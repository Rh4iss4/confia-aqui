import apiAuth from "./apiAuth";

export const cadastrarUsuario = async (nome, email, senha) => {
    return await apiAuth.post("/auth/cadastrarUsuario", {nome, email, senha})
}

export const loginUser = async (email, senha) => {
    const response = await apiAuth.post("/auth/login", {email, senha})
    const data = response.data
    const normalizedRole = data.roles?.[0]?.replace(/^ROLE_/, '') || "USER"
    return {
        token: data.token,
        user: {
            id: data.id,
            email: data.email,
            nome: data.nome,
            role: normalizedRole
        }
    }
}

export const logoutUser = async () => {
    const token = localStorage.getItem("token")
    if(!token) return
    return await apiAuth.post("/auth/logout", {}, {headers: {Authorization: `Bearer ${token}`},})
}

export const esqueciSenha = async (email) => {
    return await apiAuth.post("auth/esqueciSenha", {email})
}

export const redefinirSenha = async (token, novaSenha) => {
    return await apiAuth.post("/auth/redefinirSenha", {
        token: token,
        novaSenha: novaSenha,
        confirmarSenha: novaSenha
    })
}