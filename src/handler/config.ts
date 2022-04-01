import { APIGatewayProxyResultV2 } from 'aws-lambda';
import { Helper } from 'src/helper';

export async function handler(): Promise<APIGatewayProxyResultV2> {
  return Helper.getReturnValue({
    success: true,
    version: '1.0.0',
    push: {
      supported: false,
    },
  }, {
    'Cache-Control': 'public, max-age=7200',
  });
}
