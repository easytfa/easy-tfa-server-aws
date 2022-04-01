import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { Db } from 'src/db/db';
import { Helper } from 'src/helper';

export async function handler(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> {
  const body = JSON.parse(event.body!);
  if(body == null || !Array.isArray(body.hashes) || body.hashes.length > 20) {
    return Helper.getErrorReturnValue({
      success: false,
      error: 'VALIDATION_FAILED',
    });
  }
  let message = null;
  for(const hash of body.hashes) {
    const dbEntry = await Db.get({
      TableName: process.env.DYNAMODB_TABLE_NAME!,
      Key: {
        primaryKey: `code-query#${hash}`,
      },
    });
    if(dbEntry.Item != null) {
      message = dbEntry.Item.message;
      await Db.delete({
        TableName: process.env.DYNAMODB_TABLE_NAME!,
        Key: {
          primaryKey: `code-query#${hash}`,
        },
      });
      break;
    }
  }
  return Helper.getReturnValue({
    success: true,
    message: message,
  });
}
