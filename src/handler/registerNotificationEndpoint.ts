import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { DbHelper } from 'src/external/dbHelper';
import { ResponseHelper } from 'src/external/responseHelper';
import { IDbNotificationEndpoint } from 'src/interface/db';

export async function handler(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> {
  const body: { browserHashes: string[]; notificationEndpoint: string } = JSON.parse(event.body!);
  if(body == null || !Array.isArray(body.browserHashes) || body.browserHashes.length > 25 || typeof body.notificationEndpoint !== 'string') {
    return ResponseHelper.getErrorReturnValue({
      success: false,
      error: 'VALIDATION_FAILED',
    });
  }

  const res = await DbHelper.query({
    TableName: process.env.DYNAMODB_TABLE_NAME!,
    IndexName: 'NotificationEndpointIndex',
    KeyConditionExpression: 'notificationEndpoint = :notificationEndpoint',
    ExpressionAttributeValues: {
      ':notificationEndpoint': body.notificationEndpoint,
    },
  });

  // Remove the first 22 characters (notification-endpoint#) from primary key
  const existingNotificationEndpointHashes: string[] = (res.Items ?? []).map(entry => (entry.primaryKey as string).substring(22));

  const notificationEndpointsToRemove = existingNotificationEndpointHashes.filter(hash => !body.browserHashes.includes(hash));
  if(notificationEndpointsToRemove.length > 25) {
    // DynamoDb batchWrite doesn't support more than 25 items at once which shouldn't be a problem normally since we don't support more than 25 linked browsers
    notificationEndpointsToRemove.splice(25, notificationEndpointsToRemove.length - 25);
  }

  if(notificationEndpointsToRemove.length > 0) {
    await DbHelper.batchWrite({
      RequestItems: {
        [process.env.DYNAMODB_TABLE_NAME!]: notificationEndpointsToRemove.map(notificationEndpoint => ({
          DeleteRequest: {
            Key: {
              primaryKey: `notification-endpoint#${notificationEndpoint}`,
            },
          },
        })),
      },
    });
  }

  // Save for up to 6 months
  const expirationTime = Math.round(new Date().getTime() / 1000 + 6 * 30 * 24 * 3600);
  let message = null;
  // Do this batchWrite separately since usually we don't remove outdated notification endpoints anyway unless the user unlinked (and this makes the 25-entry-limit easier to deal with for now)
  await DbHelper.batchWrite({
    RequestItems: {
      [process.env.DYNAMODB_TABLE_NAME!]: body.browserHashes.map(browserHash => ({
        PutRequest: {
          Item: {
            primaryKey: `notification-endpoint#${browserHash}`,
            notificationEndpoint: body.notificationEndpoint,
            expirationTime: expirationTime,
          } as IDbNotificationEndpoint,
        },
      })),
    },
  });
  return ResponseHelper.getReturnValue({
    success: true,
    message: message,
  });
}
