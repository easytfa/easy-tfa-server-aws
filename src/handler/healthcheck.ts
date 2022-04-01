import { APIGatewayProxyResultV2 } from 'aws-lambda';
import { Helper } from 'src/helper';

export async function handler(): Promise<APIGatewayProxyResultV2> {
  return Helper.getReturnValue({ success: true });
}


