import axios from "axios";

export const axiosi = axios.create({
  baseURL: `https://mern-backend-beta.vercel.app/`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",          // Specify the content type
    }
});
