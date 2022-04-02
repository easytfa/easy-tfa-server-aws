import { APIGatewayProxyEvent, APIGatewayProxyResultV2 } from 'aws-lambda';
import { Db } from 'src/db/db';
import { Helper } from 'src/helper';

export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResultV2 | undefined> {
  const connectionId = event.requestContext.connectionId;
  const body = JSON.parse(event.body!);
  const data = body.data;

  const expirationTime = Math.round(new Date().getTime() / 1000 + 24 * 3600);
  await Promise.all([
    Db.put({
      TableName: process.env.DYNAMODB_TABLE_NAME!,
      Item: {
        primaryKey: `code-query#${data.hash}`,
        message: data.message,
        expirationTime: expirationTime,
      },
    }), Db.put({
      TableName: process.env.DYNAMODB_TABLE_NAME!,
      Item: {
        primaryKey: `websocket-client#${data.hash}`,
        connectionId: connectionId,
        expirationTime: expirationTime,
      },
    }),
  ]);
  // TODO - Notifications
  return Helper.getReturnValue({ event: 'query-code-started' });
}
