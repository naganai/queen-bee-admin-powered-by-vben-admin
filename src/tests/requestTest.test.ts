import UnifiedResponse from '@/models/responses/unifiedResponse';
import { axiosInstance } from '@/utils/http/request/request';
import { describe, expect, it } from 'vitest';
import AuthApi from '@/api/queenBeeApi/authApi';
import { AxiosResponse } from 'axios';
// This test is to ensure that the axiosInstance has the correct baseURL
describe('axiosInstance Test', () => {
  it('should have correct baseURL', () => {
    expect(axiosInstance.defaults.baseURL).toBe('https://localhost:44345/api');
  });

  // This test is to ensure that the axiosInstance can send a request to the server and get a response
  it('should request to the server and get a response', async () => {
    let response: AxiosResponse<any, any>;
    try {
      response = await axiosInstance.get('/test');
    } catch (error) {
      console.error(error);
      throw error;
    }

    const data: UnifiedResponse<string> = response.data;
    expect(response.status).toBe(200);
    expect(data).not.toBeNull();
    expect(data.errorCode).toBe(20000);
    console.log('Response data:', data.data);
  });

  // This test is to ensure that the authorization header is set correctly
  it('should set authorization header correctly', async () => {
    try {
      const username = '123123';
      const password = '123123';
      const response = await AuthApi.login(username, password);
      expect(response).not.toBeNull();
      expect(response.accessToken).not.toBeNull();
      expect(response.refreshToken).not.toBeNull();
      console.log('login successfully');

      const accessToken = response.accessToken;
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      const testResponse = await axiosInstance.get('/test/auth');
      expect(testResponse.status).toBe(200);
      console.log('Test response data:', testResponse.data);
    } catch (error) {
      console.error(error);
    }
  });
});
