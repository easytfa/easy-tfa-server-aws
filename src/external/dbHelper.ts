import { AWSError } from 'aws-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { PromiseResult } from 'aws-sdk/lib/request';

export class DbHelper {
  private static docClient: DocumentClient = new DocumentClient();

  public static put(params: DocumentClient.PutItemInput): Promise<PromiseResult<DocumentClient.PutItemOutput, AWSError>> {
    return this.docClient.put(params).promise();
  }

  public static get(params: DocumentClient.GetItemInput): Promise<PromiseResult<DocumentClient.GetItemOutput, AWSError>> {
    return this.docClient.get(params).promise();
  }

  public static update(params: DocumentClient.UpdateItemInput): Promise<PromiseResult<DocumentClient.UpdateItemOutput, AWSError>> {
    return this.docClient.update(params).promise();
  }

  public static query(params: DocumentClient.QueryInput): Promise<PromiseResult<DocumentClient.QueryOutput, AWSError>> {
    return this.docClient.query(params).promise();
  }

  public static delete(params: DocumentClient.DeleteItemInput): Promise<PromiseResult<DocumentClient.DeleteItemOutput, AWSError>> {
    return this.docClient.delete(params).promise();
  }
}
