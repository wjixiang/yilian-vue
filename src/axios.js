import axios from 'axios';  

const instance = axios.create({  
  baseURL: import.meta.env.VITE_API_URL, // 替换为你的后端 API 地址  
  timeout: 10000, // 请求超时时间  
});  

export default instance;