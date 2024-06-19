import ErrorCode from '@/enums/errorCodeEnum';
import UnifiedResponse from '@/models/responses/unifiedResponse';
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import https from 'https';
import { RequestError } from '@/utils/errors/error';

// Define a base URL for your API
const baseURL = import.meta.env.VITE_GLOB_API_URL;

if (!baseURL) {
  throw new Error('API base URL is not configured in ENV variables.');
}

// Create an instance of Axios with the base URL
export const axiosInstance = axios.create({
  baseURL,
  timeout: 3000,
  // use the https agent to ignore self-signed certificates
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
  }),
});

// // Define a function to handle the API response
// function handleResponse<T>(response: AxiosResponse<T>): T | RequestError {
//   const unifiedResponse = response.data as UnifiedResponse<T>;
//   if (response.status >= 200 && response.status < 300) {
//     return unifiedResponse.data as T;
//   } else {
//     if (unifiedResponse.errorCode === ErrorCode.Success) {
//       console.error('Response status:', response.status);
//       console.error('Response data:', unifiedResponse.data);
//       throw new RequestError(response.status, unifiedResponse.errorCode, unifiedResponse.message);
//     } else {
//       return undefined as T;
//     }
//   }
// }

// Define a function to handle API errors
function handleError(axiosError: AxiosError): void {
  // log the request information
  console.error('Request method:', axiosError.config?.method);
  console.error('Request URL:', axiosError.config?.url);
  if (axiosError.config?.data) {
    console.error('Request data:', JSON.parse(axiosError.config.data));
  } else {
    console.error('Request data:', axiosError.config?.data);
  }
  console.error('Request params:', axiosError.config?.params);

  // log the response information
  console.error('Response status:', axiosError.response?.status);
  console.error('Response data:', axiosError.response?.data);
  console.error('Response headers:', axiosError.response?.headers);
}

// define a common request function

async function request<T>(
  method: string,
  url: string,
  data?: any,
  config?: AxiosRequestConfig,
): Promise<T> {
  let response: AxiosResponse<UnifiedResponse<T>> | undefined;
  try {
    response = await axiosInstance.request({
      method,
      url,
      data,
      ...config,
    });

    response = response as AxiosResponse<UnifiedResponse<T>>;

    if (
      response.status >= 200 &&
      response.status < 300 &&
      response.data.errorCode === ErrorCode.Success
    ) {
      return response.data.data as T;
    } else {
      throw new RequestError(response.status, response.data.errorCode, response.data.message);
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      handleError(error);

      const responseData = error.response?.data as UnifiedResponse<T> | undefined;

      throw new RequestError(
        error.response?.status || 0,
        responseData?.errorCode || ErrorCode.ServerError,
        responseData?.message || error.message,
      );
    } else {
      throw new RequestError(0, ErrorCode.unknownError, error.message);
    }
  }
}

// Define the common HTTP methods
export async function httpGet<T>(
  url: string,
  query?: any,
  config?: AxiosRequestConfig,
): Promise<T> {
  config = config || {};
  config.params = query;
  return request<T>('GET', url, {}, config);
}

export async function httpPost<T>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig,
): Promise<T> {
  return request<T>('POST', url, data, config);
}

export async function httpPut<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
  return request<T>('PUT', url, data, config);
}

export async function httpDelete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  return request<T>('DELETE', url, undefined, config);
}
