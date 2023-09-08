import axios from "axios";

const api = {
  axiosInstance: axios.create({
    baseURL: "https://api.escuelajs.co/api/v1/auth/",
    timeout: 5000,
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
      // 201 => created
      localStorage.setItem("access_token", response.data.access_token);
      localStorage.setItem("refresh_token", response.data.refresh_token);
    }
    return response;
  },
  async (error) => {
    console.log("error");
    console.log(error);
    const refreshToken = localStorage.getItem("access_token");
    if (refreshToken) {
      const response = await api.refreshTokenExpired(refreshToken);
      console.log("response data: ", response);
    } else {
      console.log("no refresh token!");
    }
  }
);

export default api;
