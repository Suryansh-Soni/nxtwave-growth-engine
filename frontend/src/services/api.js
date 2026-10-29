import axios from "axios";

const api = axios.create({
  baseURL: "https://nxtwave-growth-engine.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;