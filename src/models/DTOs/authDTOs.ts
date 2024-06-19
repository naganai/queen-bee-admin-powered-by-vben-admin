export interface AccessTokenDto {
  token: string;
  expirationTime: Date;
}

export interface LoginResultDto {
  userId: number;
  accessToken: string;
  refreshToken: string;
  accessTokenExpirationTime: Date;
  refreshTokenExpirationTime: Date;
}
