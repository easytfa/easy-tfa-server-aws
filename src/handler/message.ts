import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { Db } from 'src/db/db';
import { Websocket } from 'src/db/websocket';
import { Helper } from 'src/helper';

export async function handler(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> {
  const body = JSON.parse(event.body!);
  if(body == null) {
    return Helper.getErrorReturnValue({
      success: false,
      error: 'VALIDATION_FAILED',
    });
  }

  const dbEntry = await Db.get({
    TableName: process.env.DYNAMODB_TABLE_NAME!,
    Key: {
      primaryKey: `websocket-client#${body.hash}`,
    },
  });
  if(dbEntry.Item == null) {
    return Helper.getReturnValue({ success: false });
  }

  await Websocket.apiGatewayManagementApi.postToConnection({
    ConnectionId: dbEntry.Item.connectionId,
    Data: JSON.stringify({
      event: 'message',
      message: body.message,
      data: body.data,
    }),
  }).promise();
  return Helper.getReturnValue({ success: true });
}
