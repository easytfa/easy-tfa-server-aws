import * as firebase from 'firebase-admin';
import { DbHelper } from 'src/external/dbHelper';

export class NotificationHelper {
  private static firebaseApp?: firebase.app.App;

  private static getApp(): firebase.app.App | undefined {
    const firebaseSdkString = process.env['NOTIFICATION_FIREBASE_ADMINSDK'];
    const projectId = process.env['NOTIFICATION_PROJECT_ID'];
    if(firebaseSdkString == null || firebaseSdkString === '' || projectId == null || projectId === '') {
      return undefined;
    }
    if(this.firebaseApp == null) {
      this.firebaseApp = firebase.initializeApp({
        credential: firebase.credential.cert(JSON.parse(firebaseSdkString)),
        projectId: projectId,
      });
    }

    return this.firebaseApp;
  }

  public static async sendNotification(browserHash: string, title: string, body: string): Promise<void> {
    const app = this.getApp();
    if(app == null) return;

    const recipient = await DbHelper.get({
      TableName: process.env.DYNAMODB_TABLE_NAME!,
      Key: {
        primaryKey: `notification-endpoint#${browserHash}`,
      },
    });
    if(recipient.Item == null) return;
    const receipientEndpoint = recipient.Item.notificationEndpoint;

    await app.messaging().send({
      token: receipientEndpoint,
      notification: {
        title,
        body,
      },
      android: {
        priority: 'high',
      },
    });
  }
}
