import { APIGatewayProxyResultV2 } from 'aws-lambda';

export class ResponseHelper {
  public static getReturnValue(object: unknown, headers?: Record<string, string>): APIGatewayProxyResultV2 {
    return {
      statusCode: 200,
      headers: {
        'content-type': 'application/json',
        ...headers,
      },
      body: JSON.stringify(object),
    };
  }
  public static getErrorReturnValue(object: unknown, headers?: Record<string, string>): APIGatewayProxyResultV2 {
    return {
      statusCode: 400,
      headers: {
        'content-type': 'application/json',
        ...headers,
      },
      body: JSON.stringify(object),
    };
  }
}
