import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { DbHelper } from 'src/external/dbHelper';
import { ResponseHelper } from 'src/external/responseHelper';
import { IDbCodeQuery } from 'src/interface/db';

export async function handler(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> {
  console.time('parse and validate body');
  const body = JSON.parse(event.body!);
  if(body == null || !Array.isArray(body.hashes) || body.hashes.length > 20) {
    return ResponseHelper.getErrorReturnValue({
      success: false,
      error: 'VALIDATION_FAILED',
    });
  }
  console.timeEnd('parse and validate body');
  let message = null;
  let connectionId = null;
  for(const hash of body.hashes) {
    console.time('get dynamodb entry');
    const dbEntry = await DbHelper.get<IDbCodeQuery>({
      TableName: process.env.DYNAMODB_TABLE_NAME!,
      Key: {
        primaryKey: `code-query#${hash}`,
      },
    });
    console.timeEnd('get dynamodb entry');
    if(dbEntry.Item != null) {
      message = dbEntry.Item.message;
      connectionId = dbEntry.Item.connectionId;
      await DbHelper.delete({
        TableName: process.env.DYNAMODB_TABLE_NAME!,
        Key: {
          primaryKey: `code-query#${hash}`,
        },
      });
      break;
    }
  }
  return ResponseHelper.getReturnValue({
    success: true,
    message: message,
    connectionId: connectionId,
  });
}
