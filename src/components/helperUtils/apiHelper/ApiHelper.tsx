import axios, {AxiosRequestConfig, AxiosResponse} from 'axios';
const API_BASE_URL = 'http://192.168.1.15:8000/api/';

if (!API_BASE_URL) {
  throw new Error('API_BASE_URL is not defined in the environment variables.');
}

interface RequestOptions {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  endpoint: string;
  data?: Record<string, unknown> | FormData; // ✅ Allow FormData
  token?: string;
}

export const apiHelper = async <T,>({
  method,
  endpoint,
  data = {},
  token,
}: RequestOptions): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;

  const config: AxiosRequestConfig = {
    method,
    url,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    data: method !== 'GET' ? data : undefined,
  };

  if (token) {
    config.headers = {...config.headers, Authorization: `Bearer ${token}`};
  }

  // Simply return the response data or a default value (e.g., empty object)
  const response: AxiosResponse<T> = await axios(config);
  return response.data;
};
