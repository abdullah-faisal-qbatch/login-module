import axios from "axios";

const api = {
  axiosInstance: axios.create({
    baseURL: "https://api.escuelajs.co/api/v1/auth/",
  }),
  axiosGoogle: axios.create({
    baseURL: "https://www.googleapis.com/oauth2/v1/userinfo",
  }),
  googleLogin: async (user) =>
    api.axiosGoogle.get(`?access_token=${user.access_token}`, {
      headers: {
        Authorization: `Bearer ${user.access_token}`,
        Accept: "application/json",
      },
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
      localStorage.setItem("access_token", response.data.access_token);
      localStorage.setItem("refresh_token", response.data.refresh_token);
    }
    return response;
  },
  async (error) => {
    console.log("Error: ", error);
  }
);

export default api;
