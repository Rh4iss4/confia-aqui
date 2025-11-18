import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Login from "./pages/Login"
import EsqueceuSenha from "./pages/EsqueceuSenha"
import RedefinirSenha from "./pages/RedefinirSenha"
import Cadastro from "./pages/Cadastro"
import Home from "./pages/Home"
//import HomeAdmin from "./pages/HomeAdmin"//
// import Teste from "./pages/Teste" // ainda não existe
import Perfil from "./pages/Perfil"
import "./App.css"
import "./index.css"

import { AuthProvider } from "./components/AuthContext"

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/esqueci-senha" element={<EsqueceuSenha />} />
          <Route path="/redefinir-senha" element={<RedefinirSenha />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/home" element={<Home />} />
         {/* <Route path="/admin/home" element={<HomeAdmin />} />*/}
          {/* <Route path="/teste" element={<Teste />} /> */}
          <Route path="/perfil" element={<Perfil />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App

