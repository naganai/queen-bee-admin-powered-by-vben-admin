import AuthApi from '@/api/queenBeeApi/authApi';
import { AccessTokenDto, LoginResultDto } from '@/models/DTOs/authDTOs';
import { describe, it, expect } from 'vitest';

// TODO: 迁移仓库

describe('AuthApi Test', () => {
  it('should login successfully', async () => {
    const username = '123123';
    const password = '123123';

    let response: LoginResultDto | undefined;
    try {
      response = await AuthApi.login(username, password);
      console.log('Response data', response);
    } catch (error) {
      console.error(error.toString());
    }
    expect(response).toBeDefined();
  });

  it('should return an error when login credentials are invalid', async () => {
    const username = 'invaliduser';
    const password = 'invalidpassword';

    let response: LoginResultDto | undefined;
    try {
      response = await AuthApi.login(username, password);
    } catch (error) {
      console.error(error.toString());
    }
    expect(response).toBeUndefined();
  });

  it('should request a new access token successfully', async () => {
    // 1. login
    const username = '123123';
    const password = '123123';
    let response: LoginResultDto | undefined;
    try {
      response = await AuthApi.login(username, password);
    } catch (error) {
      console.error(error.toString());
    }
    expect(response).toBeDefined();
    response = response as LoginResultDto;
    const refreshToken = response.refreshToken;
    console.log('Refresh token:', refreshToken);

    // 2. request new access token
    let accessTokenDto: AccessTokenDto | undefined;
    try {
      accessTokenDto = await AuthApi.refreshAccessToken(refreshToken);
      console.log('New Access token:', accessTokenDto.token);
    } catch (error) {
      console.error(error.toString());
    }

    expect(accessTokenDto).toBeDefined();
    accessTokenDto = accessTokenDto as AccessTokenDto;
    expect(accessTokenDto.token).toBeDefined();
  });

  it('should return an error when refresh token is invalid', async () => {
    const refreshToken = 'invalid_refresh_token';
    let response: AccessTokenDto | undefined;
    try {
      response = await AuthApi.refreshAccessToken(refreshToken);
    } catch (error) {
      console.error(error.toString());
    }
    expect(response).toBeUndefined();
  });
});
