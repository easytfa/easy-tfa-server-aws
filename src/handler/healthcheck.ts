import { APIGatewayProxyResultV2 } from 'aws-lambda';
import { ResponseHelper } from 'src/external/responseHelper';

export async function handler(): Promise<APIGatewayProxyResultV2> {
  return ResponseHelper.getReturnValue({ success: true });
}


