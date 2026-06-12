import axios, {AxiosRequestConfig, AxiosResponse} from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Config from 'react-native-config';

export const API_BASE_URL = Config.API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error('API_BASE_URL is not defined in the environment variables.');
}

interface RequestOptions {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  endpoint: string;
  data?: Record<string, unknown> | FormData;
  token?: string;
}

export const apiHelper = async <T,>({
  method,
  endpoint,
  data = {},
  token,
}: RequestOptions): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;

  const authToken = token || (await AsyncStorage.getItem('userToken'));

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

  if (authToken) {
    config.headers = {...config.headers, Authorization: `Bearer ${authToken}`};
  }

  try {
    const response: AxiosResponse<T> = await axios(config);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.warn(`API Error [${method} ${endpoint}]:`, {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers,
      });
      if (error.response.status === 401) {
        console.warn('Unauthorized request - token may be invalid or expired');
      }
    } else if (error.request) {
      console.warn(
        `Network Error [${method} ${endpoint}]: No response received`,
      );
    } else {
      console.warn(`Request Error [${method} ${endpoint}]:`, error.message);
    }
    throw error;
  }
};
