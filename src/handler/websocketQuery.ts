import { APIGatewayProxyEvent, APIGatewayProxyResultV2 } from 'aws-lambda';
import { Db } from 'src/db/db';
import { Helper } from 'src/helper';

export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResultV2 | undefined> {
  const connectionId = event.requestContext.connectionId;
  const body = JSON.parse(event.body!);
  const data = body.data;

  await Promise.all([
    Db.put({
      TableName: process.env.DYNAMODB_TABLE_NAME!,
      Item: {
        primaryKey: `code-query#${data.hash}`,
        message: data.message,
      },
    }), Db.put({
      TableName: process.env.DYNAMODB_TABLE_NAME!,
      Item: {
        primaryKey: `websocket-client#${data.hash}`,
        connectionId: connectionId,
      },
    }),
  ]);
  // TODO - Notifications
  return Helper.getReturnValue({ event: 'query-code-started' });
}
