import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { DbHelper } from 'src/external/dbHelper';
import { ResponseHelper } from 'src/external/responseHelper';
import { WebsocketHelper } from 'src/external/websocketHelper';

export async function handler(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> {
  const body = JSON.parse(event.body!);
  if(body == null) {
    return ResponseHelper.getErrorReturnValue({
      success: false,
      error: 'VALIDATION_FAILED',
    });
  }

  console.time('message dynamodb');
  const dbEntry = await DbHelper.get({
    TableName: process.env.DYNAMODB_TABLE_NAME!,
    Key: {
      primaryKey: `websocket-client#${body.hash}`,
    },
  });
  if(dbEntry.Item == null) {
    return ResponseHelper.getReturnValue({ success: false });
  }
  console.timeEnd('message dynamodb');

  console.time('message ws');
  await WebsocketHelper.apiGatewayManagementApi.postToConnection({
    ConnectionId: dbEntry.Item.connectionId,
    Data: JSON.stringify({
      event: 'message',
      message: body.message,
      data: body.data,
    }),
  }).promise();
  console.timeEnd('message ws');
  return ResponseHelper.getReturnValue({ success: true });
}
