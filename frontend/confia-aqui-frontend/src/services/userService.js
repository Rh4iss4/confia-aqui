import apiUser from "./apiUser";

export const getPerfil = () => {
    return apiUser.get("/user/usuarioLogado")
}

export const alterarEmail = (novoEmail) => {
    return apiUser.patch("/user/alterarEmail", {email: novoEmail})
}


export const alterarSenha = ({ senhaAtual, novaSenha, confirmarSenha }) => {
    return apiUser.patch("/user/alterarSenha", {
        senhaAtual,
        novaSenha,
        confirmarSenha
    })
}

export const excluirUser = (senha) => {
    return apiUser.delete("/user/deletaUsuario", {
        data: {
            senha: senha
        }
    });
};
