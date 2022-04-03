import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { DbHelper } from 'src/external/dbHelper';
import { ResponseHelper } from 'src/external/responseHelper';
import { IDbPublicKey } from 'src/interface/db';

export async function handler(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> {
  const body = JSON.parse(event.body!);
  if(body == null || typeof body.hash !== 'string') {
    return ResponseHelper.getErrorReturnValue({
      success: false,
      error: 'VALIDATION_FAILED',
    });
  }
  const dbEntry = await DbHelper.get<IDbPublicKey>({
    TableName: process.env.DYNAMODB_TABLE_NAME!,
    Key: {
      primaryKey: `public-key#${body.hash}`,
    },
  });
  if(dbEntry.Item == null) {
    return ResponseHelper.getReturnValue({ success: false });
  }
  return ResponseHelper.getReturnValue({
    success: true,
    publicKey: dbEntry.Item.publicKey,
    connectionId: dbEntry.Item.connectionId,
  });
}
