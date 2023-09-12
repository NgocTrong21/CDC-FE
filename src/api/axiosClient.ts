import axios from 'axios';
import { ACCESS_TOKEN, REFRESH_TOKEN } from 'constants/auth.constant';

const getLocalToken = () => {
  return window.localStorage.getItem(ACCESS_TOKEN);
};

const getRefreshToken = () => {
  return window.localStorage.getItem(REFRESH_TOKEN);
};

const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_BASE_API_URL,
});

axiosClient.interceptors.request.use(
  (config: any) => {
    const customHeaders: any = {};

    const accessToken = getLocalToken();
    if (accessToken) {
      customHeaders.Authorization = `Bearer ${accessToken}`;
    }

    return {
      ...config,
      headers: {
        ...customHeaders, // auto attach token
        ...config.headers, // but you can override for some requests
      },
    };
  },
  function (error) {
    return Promise.reject(error);
  }
);

const callRequestRefreshToken = async () => {
  return await axiosClient.post('/auth/refresh_token', {
    refreshToken: getRefreshToken(),
  })
}

// Add a response interceptor
// axiosClient.interceptors.response.use(createAxiosResponseInterceptor);
let requestRefreshToken: any = null;
let isRetry: Boolean = true;

axiosClient.interceptors.response.use(
  async (response: any) => {
    const originalRequest: any = response.config;
    if (!response.data.success && response.data.code === 401 && isRetry) {
      try {
        isRetry = false;
        requestRefreshToken = requestRefreshToken || callRequestRefreshToken();
        const res: any = await requestRefreshToken;
        requestRefreshToken = null;
        window.localStorage.setItem(ACCESS_TOKEN, res.data.data.access_token);
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + res.data.data.access_token;
        originalRequest.headers['Authorization'] = 'Bearer ' + res.data.data.access_token;
        isRetry = true;
        return axiosClient(originalRequest);
      } catch (err) {
        window.localStorage.removeItem(ACCESS_TOKEN);
        window.location.href = '/signin';
        return Promise.reject(err);
      }
    } else {
      return response;
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosClient;
