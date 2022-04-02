import * as ApiGatewayManagementApi from 'aws-sdk/clients/apigatewaymanagementapi';

export class Websocket {
  private static managementApi?: ApiGatewayManagementApi;

  public static get apiGatewayManagementApi(): ApiGatewayManagementApi {
    if(this.managementApi == null) {
      this.managementApi = new ApiGatewayManagementApi({
        apiVersion: '2018-11-29',
        endpoint: process.env['WS_ENDPOINT'],
      });
    }
    return this.managementApi;
  }
}
