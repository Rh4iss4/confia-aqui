import { useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { redefinirSenha } from "../services/authService"
import Input from "../components/Input"
import { faLock } from "@fortawesome/free-solid-svg-icons"
import BotaoForm from "../components/BotaoForm"
import MessageBox from "../components/MessageBox"

function RedefinirSenha() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const token = searchParams.get("token")

    const [novaSenha, setNovaSenha] = useState("")
    const [confirmarSenha, setConfirmarSenha] = useState("")
    const [mensagem, setMensagem] = useState("")
    const [tipoMensagem, setTipoMensagem] = useState("")
    const [erros, setErros] = useState({
    novaSenha: false,
    confirmarSenha: false,
})

    async function mudarSenha(e) {
        e.preventDefault()

        let novosErros = { novaSenha: false, confirmarSenha: false }

        if (!novaSenha) novosErros.novaSenha = true
        if(!confirmarSenha) novosErros.confirmarSenha = true

        setErros(novosErros)

        if(novaSenha !== confirmarSenha) {
            setMensagem("As senhas não são iguais. Digite novamente.")
            setTipoMensagem("erro")
            return
        }

        if(!novaSenha || !confirmarSenha) {
            setMensagem("Campo vazio. Preencha todos os campos.")
            setTipoMensagem("erro")
            return
        }

        try {
          await redefinirSenha(token, novaSenha)

          setMensagem("Senha alterada com sucesso!")
          setTipoMensagem("sucesso")

          setTimeout(() => {
            navigate("/login")
        }, 1500)
      } catch (error) {
      console.error(error)
      if (error.response) {
        if (error.response.status === 400) {
          setMensagem("Token inválido ou expirado. Solicite um novo link.")
        } else {
          setMensagem("Erro ao redefinir senha. Tente novamente.")
        }
      } else {
        setMensagem("Falha na conexão com o servidor.")
      }
      setTipoMensagem("erro")
      }
    }

    return (
  <div className="flex w-screen h-screen justify-center items-center">
    <div className="w-full max-w-md bg-white p-6">

      <h1 className="text-2xl mb-4 text-cinza-600 font-bold text-center">
        Redefinir senha
      </h1>

      {mensagem && (
        <MessageBox type={tipoMensagem} mensagem={mensagem} />
      )}

      <form onSubmit={mudarSenha} className="flex flex-col gap-3 w-full">
        <label className="text-sm text-cinza-600">Nova senha:</label>
        <Input
          type="password"
          placeholder="Digite a sua nova senha"
          value={novaSenha}
          onChange={(e) => setNovaSenha(e.target.value)}
          icon={faLock}
          isErro={erros.novaSenha}
        />

        <label className="text-sm text-cinza-600">Confirme a nova senha:</label>
        <Input
          type="password"
          placeholder="Digite a sua nova senha novamente"
          value={confirmarSenha}
          onChange={(e) => setConfirmarSenha(e.target.value)}
          icon={faLock}
          isErro={erros.confirmarSenha}
        />

        <BotaoForm text="Mudar a senha" onClick={mudarSenha} />
      </form>

    </div>
  </div>
)

}

export default RedefinirSenha