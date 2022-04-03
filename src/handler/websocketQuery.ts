import { APIGatewayProxyEvent, APIGatewayProxyResultV2 } from 'aws-lambda';
import { DbHelper } from 'src/external/dbHelper';
import { NotificationHelper } from 'src/external/notificationHelper';
import { ResponseHelper } from 'src/external/responseHelper';
import { IDbCodeQuery } from 'src/interface/db';

export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResultV2 | undefined> {
  const connectionId = event.requestContext.connectionId;
  const body = JSON.parse(event.body!);
  const data = body.data;

  const expirationTime = Math.round(new Date().getTime() / 1000 + 3600);

  await DbHelper.put({
    TableName: process.env.DYNAMODB_TABLE_NAME!,
    Item: {
      primaryKey: `code-query#${data.hash}`,
      message: data.message,
      expirationTime: expirationTime,
      connectionId: connectionId,
    } as IDbCodeQuery,
  });

  await NotificationHelper.sendNotification(data.hash, 'TFA request', 'Please check this request');
  return ResponseHelper.getReturnValue({ event: 'query-code-started' });
}
