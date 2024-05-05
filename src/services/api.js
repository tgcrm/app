import axios from "axios";

// const BASE_URL = "http://localhost:5000/";
const BASE_URL = "https://tgcrm-api-v2.vercel.app";

const api = axios.create({
  baseURL: BASE_URL,
});

export default api;
