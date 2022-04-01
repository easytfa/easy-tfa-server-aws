import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { Db } from 'src/db/db';
import { Helper } from 'src/helper';

export async function handler(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> {
  const body = JSON.parse(event.body!);
  if(body == null || typeof body.hash !== 'string') {
    return Helper.getErrorReturnValue({
      success: false,
      error: 'VALIDATION_FAILED',
    });
  }
  const dbEntry = await Db.get({
    TableName: process.env.DYNAMODB_TABLE_NAME!,
    Key: {
      primaryKey: `public-key#${body.hash}`,
    },
  });
  if(dbEntry.Item == null) {
    return Helper.getReturnValue({ success: false });
  }
  return Helper.getReturnValue({
    success: true,
    publicKey: dbEntry.Item.publicKey,
  });
}
