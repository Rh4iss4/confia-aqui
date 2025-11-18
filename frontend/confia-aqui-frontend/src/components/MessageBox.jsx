import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faExclamationCircle, faCheckCircle } from "@fortawesome/free-solid-svg-icons"

function MessageBox({ type = "sucesso", mensagem = "" }) {

  const isErro = type === "erro"

  return (
    <div
      className={`mt-4 mb-4 px-4 py-3 rounded-lg text-sm font-medium w-full 
      flex items-center justify-center gap-2
      ${isErro
        ? "bg-red-100 text-red-700 border border-red-300"
        : "bg-green-100 text-green-700 border border-green-300"
      }`}
    >
      <FontAwesomeIcon
        icon={isErro ? faExclamationCircle : faCheckCircle}
        className={isErro ? "text-red-700" : "text-green-700"}
      />

      <span>{mensagem}</span>
    </div>
  )
}

export default MessageBox
