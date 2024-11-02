import axios from 'axios'
console.log("process.env.REACT_APP_BASE_URL",    process.env.REACT_APP_BASE_URL)




export const axiosi=axios.create({withCredentials:true,baseURL:`https://mern-backend-beta.vercel.app/`});