import { APIGatewayProxyEvent, APIGatewayProxyResultV2 } from 'aws-lambda';
import * as crypto from 'crypto';
import { DbHelper } from 'src/external/dbHelper';
import { ResponseHelper } from 'src/external/responseHelper';

export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResultV2 | undefined> {
  const connectionId = event.requestContext.connectionId;
  const body = JSON.parse(event.body!);
  const data = body.data;

  const hashHex = crypto.createHash('sha256').update(data).digest('hex');
  const expirationTime = Math.round(new Date().getTime() / 1000 + 3600);
  await DbHelper.batchWrite({
    RequestItems: {
      [process.env.DYNAMODB_TABLE_NAME!]: [{
        PutRequest: {
          Item: {
            primaryKey: `public-key#${hashHex}`,
            publicKey: data,
            expirationTime: expirationTime,
          },
        },
      }, {
        PutRequest: {
          Item: {
            primaryKey: `websocket-client#${hashHex}`,
            connectionId: connectionId,
            expirationTime: expirationTime,
          },
        }
      }],
    },
  });
  return ResponseHelper.getReturnValue({ event: 'linking-started' });
}
