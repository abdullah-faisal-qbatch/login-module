import axios from "axios";

let retryCount = 0;
const MAX_RETRIES = 1;
const api = {
  axiosInstance: axios.create({
    baseURL: "https://api.escuelajs.co/api/v1/auth/",
  }),
  login: async (data) => api.axiosInstance.post("/login", data),
  refreshTokenExpired: async (refreshToken) =>
    api.axiosInstance.post("/refresh-token", {
      refreshToken,
    }),
  getUserData: async () => api.axiosInstance.get("/profile"),
};

api.axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("access_token");
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.axiosInstance.interceptors.response.use(
  async (response) => {
    if (response.status === 201) {
      //created
      localStorage.setItem("access_token", response.data.access_token);
      localStorage.setItem("refresh_token", response.data.refresh_token);
    }
    return response;
  },
  async (error) => {
    // const statusCode = error?.response?.status;
    // if (statusCode === 401 && retryCount < MAX_RETRIES) {
    //   retryCount++;

    //   let refreshToken = localStorage.getItem("refresh_token");

    //   if (refreshToken) {
    //     if (localStorage.getItem("loginMethod") === "google") {
    //       console.log("I am here in refresh token!");
    //       const body = {
    //         grant_type: "refresh_token",
    //         client_id:
    //           "126582545391-pab79eacjtmrm5bldpg4nsadmkv3o1r8.apps.googleusercontent.com",
    //         client_secret: "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",
    //         refresh_token: refreshToken,
    //       };

    //       const refreshResponse = await api.axiosInstance.post(
    //         "https://oauth2.googleapis.com/token",
    //         body
    //       );

    //       const newAccessToken = refreshResponse.data.access_token;
    //       localStorage.setItem("access_token", newAccessToken);
    //     } else {
    //       const refreshResponse = await api.axiosInstance.post(
    //         "auth/refresh-token",
    //         {
    //           refreshToken: refreshToken,
    //         }
    //       );

    //       const newAccessToken = refreshResponse.data.access_token;
    //       const newRefreshToken = refreshResponse.data.refresh_token;
    //       localStorage.setItem("access_token", newAccessToken);
    //       localStorage.setItem("refresh_token", newRefreshToken);
    //     }

    //     const originalRequest = error.config;
    //     return api.axiosInstance(originalRequest);
    //   }
    // }

    return Promise.reject(error);
  }
);

export default api;
