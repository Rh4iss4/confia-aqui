import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Input from "../components/Input"
import { faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons"
import BotaoForm from "../components/BotaoForm"
import LinkTexto from "../components/LinkTexto"
import imagemLayoutForm from "../images/imagemLayoutForm.png"
import MessageBox from "../components/MessageBox"
import { loginUser } from "../services/authService"

function Login() {
    const navigate = useNavigate()
    const [email, setEmail] = useState("")
    const [senha, setSenha] = useState("")
    const [mensagem, setMensagem] = useState("")
    const [tipoMensagem, setTipoMensagem] = useState("")
    const [erros, setErros] = useState({
    email: false,
    senha: false,
})

    async function fazerLogin(e) {
        e.preventDefault()


        let novosErros = { email: false, senha: false }


        if (!email) novosErros.email = true
        if (!senha) novosErros.senha = true


        setErros(novosErros)


        if(!email || !senha) {
            setMensagem("Campo vazio. Preencha todos os campos.")
            setTipoMensagem("erro")
            return
        }
       
        try {
          const resposta = await loginUser(email, senha)

          if (resposta && resposta.token && resposta.user) {
            localStorage.setItem("token", resposta.token)
            localStorage.setItem("user", JSON.stringify(resposta.user))

            setMensagem("Login realizado com sucesso!")
            setTipoMensagem("sucesso")

            const role = resposta.user.role ? resposta.user.role.toUpperCase() : "USER"
            setTimeout(() => navigate(role === "ADMIN" ? "/admin/home" : "/home"), 1500)
          } else {
            setMensagem("Erro inesperado ao fazer login.")
            setTipoMensagem("erro")
          }
        } catch (erro) {
          console.error("Erro ao fazer login:", erro)
          if (erro.response?.status === 401) {
            setMensagem("E-mail ou senha incorretos.")
          } else {
            setMensagem("Erro ao conectar com o servidor.")
          }
          setTipoMensagem("erro")
        }
    }

    return (
       <div className="flex h-screen w-screen flex-col md:flex-row">
  <div className="w-full md:w-1/2 h-[50vh] md:h-full flex flex-col justify-center items-center p-8 sm:p-12 md:p-16 bg-white">
    <div className="w-full flex flex-col justify-center items-center">
      <h1 className="text-2xl mb-4 text-cinza-600 font-bold text-center">Login</h1>

      {mensagem && (
          <MessageBox type={tipoMensagem} mensagem={mensagem} />
    )}

      <form onSubmit={fazerLogin} className="flex flex-col gap-3 w-full">
        <label className="text-sm text-cinza-600">Email:</label>
        <Input
          type="email"
          placeholder="Digite o seu e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icon={faEnvelope}
          isErro={erros.email}
        />

        <label className="text-sm text-cinza-600">Senha:</label>
        <Input
          type="password"
          placeholder="Digite a sua senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          icon={faLock}
          isErro={erros.senha}
        />

        <BotaoForm text="Login" onClick={fazerLogin} />

        <div className="flex justify-between text-sm mt-1 gap-4">
          <LinkTexto to={"/esqueci-senha"} text="Esqueceu a senha?" />
          <LinkTexto to={"/cadastro"} text="Ainda não possui uma conta?" />
        </div>
      </form>
    </div>
  </div>

  <div className="w-full md:w-1/2 h-[50vh] md:h-full flex items-center justify-center bg-azul p-8 md:p-0">
    <img
      src={imagemLayoutForm}
      alt="Ilustração de um homem com lupa analisando um computador"
      className="w-56 sm:w-64 md:w-80 object-contain"
    />
  </div>
</div>
    )
}

export default Login