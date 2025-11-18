import axios from "axios"

const apiAuth = axios.create({
    baseURL: import.meta.env.VITE_API_AUTH_URL, 
    headers: {"Content-Type": "application/json"},
})

apiAuth.interceptors.request.use((config) => {
    const token = localStorage.getItem("token")
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
        console.log("[apiAuth] Token added to request:", token.substring(0, 20) + "...")
    } else {
        console.warn("[apiAuth] No token found in localStorage")
    }
    return config
}, 
    (error) => Promise.reject(error)
)

apiAuth.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        console.warn("Sessão expirada. Redirecionando para login...");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }

      if (error.response.status >= 500) {
        console.error("Erro interno do servidor:", error.response.data);
      }
    } else {
      console.error("Erro de conexão com o servidor:", error.message);
    }

    return Promise.reject(error);
  }
);

export default apiAuth