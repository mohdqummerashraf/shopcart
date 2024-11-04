import axios from "axios";

export const axiosi = axios.create({
  baseURL: `http://localhost:4040`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",          // Specify the content type
    }
});
