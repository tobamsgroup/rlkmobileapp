import { GuardianLoginSession, KidLoginSession } from "@/types";
import axiosInstance from "axios";
import { getData, removeData, storeData } from "./storage";

const axios = axiosInstance.create({
  baseURL: "https://rl4kids-be.onrender.com/api/v1",
  // baseURL: "http://localhost:5500/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

axios.interceptors.request.use(async (config) => {
  const user = await getData<GuardianLoginSession | KidLoginSession>("user");

  if (user?.accessToken) {
    config.headers.Authorization = `Bearer ${user.accessToken}`;
  }

  return config;
});

// let isRefreshing = false;
// let failedQueue: {
//   resolve: (token: string) => void;
//   reject: (error: any) => void;
// }[] = [];

// const processQueue = (error: any, token: string | null = null) => {
//   failedQueue.forEach(({ resolve, reject }) => {
//     if (error) {
//       reject(error);
//     } else if (token) {
//       resolve(token);
//     }
//   });

//   failedQueue = [];
// };

// axios.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     if (error.response?.status === 401 && !originalRequest._retry) {
//       const user = await getData<GuardianLoginSession | KidLoginSession>("user");
//       originalRequest._retry = true;

//       if (isRefreshing) {
//         return new Promise((resolve, reject) => {
//           failedQueue.push({
//             resolve: (token: string) => {
//               originalRequest.headers["Authorization"] = `Bearer ${token}`;
//               resolve(axios(originalRequest));
//             },
//             reject: (err: any) => reject(err),
//           });
//         });
//       }

//       isRefreshing = true;

//       try {
//         const response = await axiosInstance.post(
//           "https://rl4kids-be.onrender.com/api/v1/auth/refresh-token",
//           { refreshToken: user?.refreshToken }
//         );

//         const newAccessToken = response.data?.data.accessToken;
//         const userData = await getData<GuardianLoginSession | KidLoginSession>(
//           "user"
//         );
//          await storeData("user", {
//           ...userData,
//           accessToken: newAccessToken,
//         });

//         if (originalRequest.headers) {
//           originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
//         }
//         axios.defaults.headers.common["Authorization"] =
//           `Bearer ${newAccessToken}`;

//         processQueue(null, newAccessToken);
//         return axios(originalRequest);
//       } catch (refreshError: any) {
//         if (refreshError?.status === 401) {
//           await removeData('user')
//         }
//         processQueue(refreshError, null);
//         return Promise.reject(refreshError);
//       } finally {
//         isRefreshing = false;
//       }
//     }

//     return Promise.reject(error);
//   }
// );
export default axios;
