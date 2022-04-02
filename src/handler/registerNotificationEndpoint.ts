import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { DbHelper } from 'src/external/dbHelper';
import { ResponseHelper } from 'src/external/responseHelper';

export async function handler(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> {
  const body = JSON.parse(event.body!);
  if(body == null || !Array.isArray(body.browserHashes) || body.browserHashes.length > 20 || typeof body.notificationEndpoint !== 'string') {
    return ResponseHelper.getErrorReturnValue({
      success: false,
      error: 'VALIDATION_FAILED',
    });
  }

  // Save for up to 6 months
  const expirationTime = Math.round(new Date().getTime() / 1000 + 6 * 30 * 24 * 3600);
  let message = null;
  await Promise.all(body.browserHashes.map((browserHash: string) => DbHelper.put({
    TableName: process.env.DYNAMODB_TABLE_NAME!,
    Item: {
      primaryKey: `notification-endpoint#${browserHash}`,
      notificationEndpoint: body.notificationEndpoint,
      expirationTime: expirationTime,
    },
  })));
  return ResponseHelper.getReturnValue({
    success: true,
    message: message,
  });
}
