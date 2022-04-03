export interface IDbItem {
  primaryKey: string;
  expirationTime: number;
}

export interface IDbPublicKey extends IDbItem {
  publicKey: string;
  connectionId: string;
}

export interface IDbCodeQuery extends IDbItem {
  message: string;
  connectionId: string;
}

export interface IDbNotificationEndpoint extends IDbItem {
  notificationEndpoint: string;
}
