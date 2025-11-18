import { createContext, useState, useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { loginUser, logoutUser } from "../services/authService"
import apiAuth from "../services/apiAuth"

export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    const token = localStorage.getItem("token")

    if (storedUser && token) {
      setUser(JSON.parse(storedUser))
      apiAuth.defaults.headers.common["Authorization"] = `Bearer ${token}`
    }
  }, [])

  const login = async (email, senha) => {
    try {
      const {token, user} = await loginUser(email, senha)

      localStorage.setItem("token", token)
      localStorage.setItem("user", JSON.stringify(user))
      apiAuth.defaults.headers.common["Authorization"] = `Bearer ${token}`
      setUser(user)

      navigate(user.role === "ADMIN" ? "/admin/home" : "/home") 
    } catch (error) {
      console.error("Erro no login:", error)
      throw error
    }
  }

  const logout = async () => {
    try {
      await logoutUser()
    } catch (error) {
      console.warn("Erro ao chamar logout no back-end:", error)
    } finally {
      localStorage.clear()
      setUser(null)
      delete apiAuth.defaults.headers.common["Authorization"]
      navigate("/login")
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}