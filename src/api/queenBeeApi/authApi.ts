import { AccessTokenDto, LoginResultDto } from '@/models/DTOs/authDTOs';
import { httpGet, httpPost } from '@/utils/http/request/request';

const Api = {
  Login: '/auth/login',
  RefreshAccessToken: '/auth/access-token',
};

/**
 * Represents an API for authentication.
 */
export default class AuthApi {
  /**
   * Logs in a user with the provided username and password.
   * @param username - The username of the user.
   * @param password - The password of the user.
   * @returns The Login result.
   */
  static async login(username: string, password: string): Promise<LoginResultDto> {
    const response = await httpPost<LoginResultDto>(Api.Login, { username, password });
    return response;
  }

  /**
   * Refreshes the access token using the provided refresh token.
   * @param refreshToken - The refresh token.
   * @returns A new access token.
   */
  static async refreshAccessToken(refreshToken: string): Promise<AccessTokenDto> {
    const response = await httpGet<AccessTokenDto>(Api.RefreshAccessToken, { refreshToken });
    return response;
  }
}
