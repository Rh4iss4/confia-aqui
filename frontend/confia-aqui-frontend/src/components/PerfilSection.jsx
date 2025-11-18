import { useState, useEffect } from "react"
import { getPerfil, alterarEmail, alterarSenha } from "../services/userService"
import Input from "../components/Input"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEdit, faSave, faEnvelope, faUser, faLock } from "@fortawesome/free-solid-svg-icons"
import MessageBox from "./MessageBox"
import LinkTexto from "../components/LinkTexto"

function PerfilSection(){
    const [dados, setDados] = useState({
        nome: "",
        email: "",
      })
      const [novoEmail, setNovoEmail] = useState("")
      const [senhaAtual, setSenhaAtual] = useState("")
      const [novaSenha, setNovaSenha] = useState("")
      const [confirmarSenha, setConfirmarSenha] = useState("")
      const [erros, setErros] = useState({
        senhaAtual: "",
        novaSenha: "",
        confirmarSenha: ""
      })
      const [editandoEmail, setEditandoEmail] = useState(false)
      const [editandoSenha, setEditandoSenha] = useState(false)
      const [mensagem, setMensagem] = useState("")
      const [tipoMensagem, setTipoMensagem] = useState("")
    
      useEffect(() => {
        const carregar = async () => {
          try {
            const resposta = await getPerfil()
            setDados({
              nome: resposta.data.nome || "",
              email: resposta.data.email || "",
            })
            setNovoEmail(resposta.data.email || "")
          } catch (error) {
            console.error("Erro ao carregar perfil:", error)
            setMensagem("Erro ao carregar informações do usuário.")
            setTipoMensagem("erro")
          } 
        }
    
        carregar()
      }, [])
    
      const salvarEmail = async () => {
        try {
          await alterarEmail(novoEmail)
          setDados((prev) => ({ ...prev, email: novoEmail }))
          setEditandoEmail(false)
          setMensagem("E-mail atualizado com sucesso!")
          setTipoMensagem("sucesso")
        } catch (error) {
          console.error("Erro ao atualizar e-mail:", error)
          setMensagem("Erro ao atualizar e-mail. Tente novamente.")
          setTipoMensagem("erro")
        }
      }
    
      const salvarSenha = async () => {
        const novosErros = {
          senhaAtual: "",
          novaSenha: "",
          confirmarSenha: ""
        }

        if (!senhaAtual) novosErros.senhaAtual = "Digite sua senha atual."
        if (!novaSenha) novosErros.novaSenha = "Digite sua nova senha."
        if (novaSenha.length <6) novosErros.novaSenha = "A senha deve ter no mínimo 6 caracteres."
        if (confirmarSenha !== novaSenha) novosErros.confirmarSenha = "As senhas não são iguais. Digite novamente."

        if (novosErros.senhaAtual || novosErros.novaSenha || novosErros.confirmarSenha) {
          setErros(novosErros)
          return
        }

        try {
          await alterarSenha({
            senhaAtual: senhaAtual,
            novaSenha: novaSenha,
            confirmarSenha: confirmarSenha
          })

          setEditandoSenha(false)
          setSenhaAtual("")
          setNovaSenha("")
          setConfirmarSenha("")
          setMensagem("Senha atualizada com sucesso!")
          setTipoMensagem("sucesso")
        } catch (error) {
          console.error("Erro ao atualizar senha:", error)
          setMensagem("Erro ao atualizar senha. Tente novamente.")
          setTipoMensagem("erro")
        }
      }
    return (
    <main className="flex justify-center items-center px-4 pt-16 w-screen bg-gray-50">
      <div className="bg-white rounded-2xl shadow-xl w-screen p-10 mt-2 lg:mt-8">
        <h2 className="text-2xl font-bold text-cinza-600 mb-8">Meu Perfil</h2>

        {mensagem && (
          <MessageBox type={tipoMensagem} mensagem={mensagem} />
    )}

        <div className="mb-6">
          <label className="text-base text-cinza-600 block mb-2">Nome:</label>
          <Input
            type="text"
            name="nome"
            icon={faUser}
            disabled
            placeholder={dados.nome || "Seu nome"}
          />
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <label className="text-base text-cinza-600">E-mail:</label>
            <button
              onClick={() => (editandoEmail ? salvarEmail() : setEditandoEmail(true))}
              className="text-sm text-azul hover:opacity-80 flex items-center gap-1"
            >
              <FontAwesomeIcon icon={editandoEmail ? faSave : faEdit} />
              {editandoEmail ? "Salvar" : "Editar"}
            </button>
          </div>
          <Input
            type="email"
            name="email"
            value={editandoEmail ? novoEmail : ""}
            onChange={(e) => setNovoEmail(e.target.value)}
            icon={faEnvelope}
            disabled={!editandoEmail}
            placeholder={!editandoEmail ? dados.email : "Digite seu novo e-mail"}
          />
        </div>

        <div className="mt-6">
          <div className="flex justify-between items-center mb-2">
            <label className="text-base text-cinza-600">Senha:</label>
            <button
              onClick={() => (editandoSenha ? salvarSenha() : setEditandoSenha(true))}
              className="text-sm text-azul hover:opacity-80 flex items-center gap-1"
            >
              <FontAwesomeIcon icon={editandoSenha ? faSave : faEdit} />
              {editandoSenha ? "Salvar" : "Editar"}
            </button>
          </div>

          <div className="mb-2">
          <Input
            type="password"
            name="senhaAtual"
            value={editandoSenha ? senhaAtual : ""}
            onChange={(e) => {
            setSenhaAtual(e.target.value)
            setErros((prev) => ({ ...prev, senhaAtual: "" }))
          }}
            icon={faLock}
            disabled={!editandoSenha}
            placeholder={editandoSenha ? "Digite sua senha atual" : "********"}
            isErro={!!erros.senhaAtual}
          />
          {erros.senhaAtual && <p className="text-red-500 text-sm">{erros.senhaAtual}</p>}
          </div>

          <div className="mb-2">
          <Input
            type="password"
            name="novaSenha"
            value={editandoSenha ? novaSenha : ""}
            onChange={(e) => {
            setNovaSenha(e.target.value)
            setErros((prev) => ({ ...prev, novaSenha: "" }))
          }}
            icon={faLock}
            disabled={!editandoSenha}
            placeholder={editandoSenha ? "Digite a nova senha" : "********"}
            isErro={!!erros.novaSenha}
          />
          {erros.novaSenha && <p className="text-red-500 text-sm">{erros.novaSenha}</p>}
          </div>

          <div className="mb-2">
          <Input
            type="password"
            name="confirmarSenha"
            value={editandoSenha ? confirmarSenha : ""}
            onChange={(e) => {
            setConfirmarSenha(e.target.value)
            setErros((prev) => ({ ...prev, confirmarSenha: "" }))
          }}
            icon={faLock}
            disabled={!editandoSenha}
            placeholder={editandoSenha ? "Confirme a nova senha" : "********"}
            isErro={!!erros.confirmarSenha}
          />
            {erros.confirmarSenha && <p className="text-red-500 text-sm">{erros.confirmarSenha}</p>}
        </div>
        </div>
        <LinkTexto to={"/esqueci-senha"} text="Esqueceu a senha?"/>
        </div>
    </main>
    )
}

export default PerfilSection