import { useState } from "react"
import { esqueciSenha } from "../services/authService.js"
import Input from "../components/Input"
import BotaoForm from "../components/BotaoForm.jsx"
import MessageBox from "../components/MessageBox.jsx"
import { faEnvelope } from "@fortawesome/free-solid-svg-icons"

function EsqueceuSenha(){
    const [email, setEmail] = useState("")
    const [mensagem, setMensagem] = useState("")
    const [tipoMensagem, setTipoMensagem] = useState("")
    const [erro, setErro] = useState(false)
    const [carregando, setCarregando] = useState(false)

    async function enviarEmail(e) {
        e.preventDefault()
        setMensagem("")
        setTipoMensagem("")
        setErro(false)

        if (!email) {
            setErro(true)
            setMensagem("Por favor, insira seu email.")
            setTipoMensagem("erro")
            return
        }

        try {
            setCarregando(true)
            await esqueciSenha(email)

            setMensagem("Enviamos um link para o seu email. Verifique sua caixa de entrada.")
            setTipoMensagem("sucesso")
            setEmail("")
        } catch (error) {
            console.error(error)
            if (error.response && error.response.status === 404) {
                setMensagem("Email não encontrado.") 
            } else {
                setMensagem("Erro ao enviar o email. Tente novamente.")
            }
            setTipoMensagem("erro")
        } finally {
            setCarregando(false)
        }
    }

    return (
        <div className="flex w-screen h-screen justify-center items-center">
    <div className="w-full max-w-md p-6 bg-white">

      <h1 className="text-2xl mb-6 text-cinza-600 font-bold text-center">Esqueci minha senha</h1>

      {mensagem && (
          <MessageBox type={tipoMensagem} mensagem={mensagem} />
    )}

      <form onSubmit={enviarEmail} className="flex flex-col gap-3 w-full">
        <label className="text-sm text-cinza-600">Email cadastrado:</label>
        <Input
          type="email"
          placeholder="Digite o seu email"
          value={email}
          onChange={(e) => setEmail(e.target.value)} icon={faEnvelope} isErro={erro} required
        />

        <BotaoForm text={carregando ? "Enviando..." : "Enviar link"} disabled={carregando} />
      </form>
    </div>
    </div>
    )
}

export default EsqueceuSenha