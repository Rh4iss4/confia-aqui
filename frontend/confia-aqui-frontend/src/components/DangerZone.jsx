import { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTrash, faTimes, faLock } from "@fortawesome/free-solid-svg-icons"
import { excluirUser } from "../services/userService"
import Input from "../components/Input"
import MessageBox from "./MessageBox"

function DangerZone(){
    const [mostrarModal, setMostrarModal] = useState(false)
    const [carregando, setCarregando] = useState(false)
    const [mensagem, setMensagem] = useState("")
    const [tipoMensagem, setTipoMensagem] = useState("")
    const [senha, setSenha] = useState("")

    const excluirConta = async () => {
      if (!senha.trim()) {
        setTipoMensagem("erro")
        setMensagem("Digite sua senha para continuar.")
        return
      }

        try {
            setCarregando(true)
            await excluirUser(senha)
            setTipoMensagem("sucesso")
            setMensagem("Conta excluída com sucesso!")
            setTimeout(() => {
                localStorage.clear()
                window.location.href = "/login"
            }, 1500);

        } catch (error) {
            console.error("Erro ao excluir conta", error)
            setTipoMensagem("erro")
            
            if (error.response?.status === 401) {
              setMensagem("Senha incorreta. Tente novamente.")
            } else {
            setMensagem("Erro ao excluir conta. Tente novamente")
        } 
      } finally {
            setCarregando(false)
            setMostrarModal(false)
            setSenha("")
        }
    }

    return (
        <div className="mt-4 flex flex-col justify-center items-center w-full p-10 bg-gray-50">
        <div className="bg-white rounded-2xl shadow-xl p-4 m-4 w-full">
          {mensagem && (
          <MessageBox type={tipoMensagem} mensagem={mensagem} />
    )}

      <div className="flex flex-col items-start w-full">
      <h2 className="text-2xl font-bold text-red-600 mb-4">Excluir Conta</h2>
      <p className="text-cinza-600 font-normal text-sm mb-4">Exclua sua conta de forma permanente. Essa ação não pode ser desfeita, então prossiga com cuidado.</p>

    <div className="w-full flex justify-end">
      <button
        onClick={() => setMostrarModal(true)}
        className="flex items-center gap-1 bg-red-600 text-white px-5 py-2 mb-4 rounded-xl text-sm font-normal hover:bg-red-700 transition"
      >Excluir Conta</button>
    </div>
      </div>

      {mostrarModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-[90%] max-w-[400px] relative">
            <button
              onClick={() => setMostrarModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>

            <h2 className="text-2xl font-semibold text-gray-800 text-center mb-3">
              Excluir Conta
            </h2>
            {mensagem && (
          <MessageBox type={tipoMensagem} mensagem={mensagem} />
    )}
            <p className="text-gray-600 text-center mb-4">
              Digite sua senha para excluir sua conta definitivamente.</p>
            <Input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} placeholder="Digite sua senha"icon={faLock}/>

            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={() => setMostrarModal(false)}
                className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 transition"
              >
                Cancelar
              </button>
              <button
                onClick={excluirConta}
                disabled={carregando}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
              >
                {carregando ? "Excluindo..." : "Confirmar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
    )
}

export default DangerZone