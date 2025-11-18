import axios from "axios";

const apiUser = axios.create({
    baseURL: import.meta.env.VITE_API_USER_URL,
    headers: {"Content-Type": "application/json"},
})

apiUser.interceptors.request.use((config) => {
    const token = localStorage.getItem("token")
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
}, 
(error) => Promise.reject(error)
)

export default apiUser