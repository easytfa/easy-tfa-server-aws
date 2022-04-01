import { AWSError, DynamoDB } from 'aws-sdk';
import { PromiseResult } from 'aws-sdk/lib/request';

export class Db {
  private static docClient: DynamoDB.DocumentClient = new DynamoDB.DocumentClient();

  public static put(params: DynamoDB.DocumentClient.PutItemInput): Promise<PromiseResult<DynamoDB.DocumentClient.PutItemOutput, AWSError>> {
    return this.docClient.put(params).promise();
  }

  public static get(params: DynamoDB.DocumentClient.GetItemInput): Promise<PromiseResult<DynamoDB.DocumentClient.GetItemOutput, AWSError>> {
    return this.docClient.get(params).promise();
  }

  public static update(params: DynamoDB.DocumentClient.UpdateItemInput): Promise<PromiseResult<DynamoDB.DocumentClient.UpdateItemOutput, AWSError>> {
    return this.docClient.update(params).promise();
  }

  public static query(params: DynamoDB.DocumentClient.QueryInput): Promise<PromiseResult<DynamoDB.DocumentClient.QueryOutput, AWSError>> {
    return this.docClient.query(params).promise();
  }

  public static delete(params: DynamoDB.DocumentClient.DeleteItemInput): Promise<PromiseResult<DynamoDB.DocumentClient.DeleteItemOutput, AWSError>> {
    return this.docClient.delete(params).promise();
  }
}
