import { logout } from '@/redux/authSlice';
import store from '@/redux/store';
import { GuardianLoginSession, KidLoginSession } from '@/types';
import { showToast } from '@/utils/toast';
import axiosLib, { AxiosError } from 'axios';
import { getData, removeData } from './storage';

const SESSION_INVALID_CODES = [
  'TOKEN_EXPIRED',
  'INVALID_TOKEN',
  'TOKEN_REVOKED',
];

const axios = axiosLib.create({
  baseURL: 'https://rl4kids-be.onrender.com/api/v1',
  // baseURL: "http://10.252.250.22:5500/api/v1",
  // baseURL: "http://localhost:5500/api/v1",
  headers: {
    'Content-Type': 'application/json',
  },
});

const getJWTExpiry = (token: string): number | null => {
  try {
    const payload = token.split('.')[1];
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
    const decoded = JSON.parse(atob(padded));
    return typeof decoded.exp === 'number' ? decoded.exp : null;
  } catch {
    return null;
  }
};

let isHandlingExpiry = false;

const handleSessionExpired = async () => {
  if (isHandlingExpiry) return;
  isHandlingExpiry = true;
  try {
    await removeData('user');
    store.dispatch(logout());
    showToast('error', 'Your session has expired. Please log in again.');
  } finally {
    setTimeout(() => {
      isHandlingExpiry = false;
    }, 3000);
  }
};

axios.interceptors.request.use(async (config) => {
  const user = await getData<GuardianLoginSession | KidLoginSession>('user');

  console.log(user?.accessToken);

  if (user?.accessToken) {
    const exp = getJWTExpiry(user.accessToken);
    if (exp !== null && Date.now() / 1000 >= exp) {
      await handleSessionExpired();
      return Promise.reject(new AxiosError('Session expired'));
    }
    config.headers.Authorization = `Bearer ${user.accessToken}`;
  }

  return config;
});

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const wasAuthenticated = !!error.config?.headers?.Authorization;
    if (error.response?.status === 401 && wasAuthenticated) {
      const backendCode =
        error.response?.data?.errorCode ?? error.response?.data?.code;

      const isSessionInvalid =
        error.response?.status === 401 &&
        wasAuthenticated &&
        SESSION_INVALID_CODES.includes(backendCode);

      if (isSessionInvalid) {
        await handleSessionExpired();
      }

      return Promise.reject(error);
    }
    return Promise.reject(error);
  },
);

export default axios;
