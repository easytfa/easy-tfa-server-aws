import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { ResponseHelper } from 'src/external/responseHelper';
import { WebsocketHelper } from 'src/external/websocketHelper';

export async function handler(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> {
  const body = JSON.parse(event.body!);
  if(body == null || body.connectionId == null || typeof body.connectionId !== 'string') {
    return ResponseHelper.getErrorReturnValue({
      success: false,
      error: 'VALIDATION_FAILED',
    });
  }

  await WebsocketHelper.apiGatewayManagementApi.postToConnection({
    ConnectionId: body.connectionId,
    Data: JSON.stringify({
      event: 'message',
      message: body.message,
      data: body.data,
    }),
  }).promise();
  return ResponseHelper.getReturnValue({ success: true });
}
