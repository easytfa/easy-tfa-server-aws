import { AWSError } from 'aws-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { PromiseResult } from 'aws-sdk/lib/request';

export class DbHelper {
  private static docClient: DocumentClient = new DocumentClient();

  public static put(params: DocumentClient.PutItemInput): Promise<PromiseResult<DocumentClient.PutItemOutput, AWSError>> {
    return this.docClient.put(params).promise();
  }

  public static get<T=unknown>(params: DocumentClient.GetItemInput): Promise<PromiseResult<DocumentClient.GetItemOutput & { Item: T | undefined }, AWSError>> {
    return this.docClient.get(params).promise() as Promise<PromiseResult<DocumentClient.GetItemOutput & { Item: T | undefined }, AWSError>>;
  }

  public static batchWrite(params: DocumentClient.BatchWriteItemInput): Promise<PromiseResult<DocumentClient.BatchWriteItemOutput, AWSError>> {
    return this.docClient.batchWrite(params).promise();
  }

  public static query(params: DocumentClient.QueryInput): Promise<PromiseResult<DocumentClient.QueryOutput, AWSError>> {
    return this.docClient.query(params).promise();
  }

  public static delete(params: DocumentClient.DeleteItemInput): Promise<PromiseResult<DocumentClient.DeleteItemOutput, AWSError>> {
    return this.docClient.delete(params).promise();
  }
}
