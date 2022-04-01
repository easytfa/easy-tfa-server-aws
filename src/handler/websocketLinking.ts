import { APIGatewayProxyEvent, APIGatewayProxyResultV2 } from 'aws-lambda';
import * as crypto from 'crypto';
import { Db } from 'src/db/db';
import { Helper } from 'src/helper';

export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResultV2 | undefined> {
  const connectionId = event.requestContext.connectionId;
  const body = JSON.parse(event.body!);
  const data = body.data;

  const hashHex = crypto.createHash('sha256').update(data).digest('hex');
  await Promise.all([
    Db.put({
      TableName: process.env.DYNAMODB_TABLE_NAME!,
      Item: {
        primaryKey: `public-key#${hashHex}`,
        publicKey: data,
      },
    }), Db.put({
      TableName: process.env.DYNAMODB_TABLE_NAME!,
      Item: {
        primaryKey: `websocket-client#${hashHex}`,
        connectionId: connectionId,
      },
    }),
  ]);
  return Helper.getReturnValue({ event: 'linking-started' });
}
