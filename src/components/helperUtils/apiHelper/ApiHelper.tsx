import axios, {AxiosRequestConfig, AxiosResponse} from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const API_BASE_URL = 'http://192.168.1.19:8000/api/';

if (!API_BASE_URL) {
  throw new Error('API_BASE_URL is not defined in the environment variables.');
}

interface RequestOptions {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  endpoint: string;
  data?: Record<string, unknown> | FormData; // Allow FormData for file uploads
  token?: string; // Optional token (can be from Redux or elsewhere)
}

export const apiHelper = async <T,>({
  method,
  endpoint,
  data = {},
  token,
}: RequestOptions): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;

  // Use provided token, or fall back to AsyncStorage if no token is passed
  const authToken = token || (await AsyncStorage.getItem('userToken'));

  // // Log the token for debugging
  // if (!authToken) {
  //   console.warn(`No token found for request to ${endpoint}`);
  // } else {
  //   console.log(`Using token for ${endpoint}: ${authToken}`);
  // }

  const config: AxiosRequestConfig = {
    method,
    url,
    headers: {
      'Content-Type':
        data instanceof FormData ? 'multipart/form-data' : 'application/json',
      Accept: 'application/json',
    },
    data: method !== 'GET' ? data : undefined,
  };

  // Add Authorization header if token exists
  if (authToken) {
    config.headers = {...config.headers, Authorization: `Bearer ${authToken}`};
  }

  try {
    const response: AxiosResponse<T> = await axios(config);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error(`API Error [${method} ${endpoint}]:`, {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers,
      });
      if (error.response.status === 401) {
        console.warn('Unauthorized request - token may be invalid or expired');
      }
    } else if (error.request) {
      console.error(
        `Network Error [${method} ${endpoint}]: No response received`,
      );
    } else {
      console.error(`Request Error [${method} ${endpoint}]:`, error.message);
    }
    throw error; // Re-throw for caller to handle
  }
};
