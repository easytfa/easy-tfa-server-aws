import { APIGatewayProxyResultV2 } from 'aws-lambda';
import { ResponseHelper } from 'src/external/responseHelper';

export async function handler(): Promise<APIGatewayProxyResultV2> {
  const apiKey = process.env['NOTIFICATION_API_KEY'];
  const applicationId = process.env['NOTIFICATION_APPLICATION_ID'];
  const projectId = process.env['NOTIFICATION_PROJECT_ID'];
  return ResponseHelper.getReturnValue({
    success: true,
    version: '1.0.0',
    push: {
      supported: apiKey !== '' && applicationId !== '' && projectId !== '',
      apiKey: apiKey,
      applicationId: applicationId,
      projectId: projectId,
    },
  }, {
    'Cache-Control': 'public, max-age=86400',
  });
}
