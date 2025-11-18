import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

function Input({type = "text", placeholder, value, onChange, icon, isErro, disabled}){
    return (
        <div className="relative w-full mt-1">
            <FontAwesomeIcon icon={icon} className="absolute left-3 top-1/2 -translate-y-1/2 text-cinza-500"/>
        <input type={type} placeholder={placeholder} className={`border rounded-xl pl-10 pr-3 py-2 w-full outline-none transition-all
    ${isErro
      ? "border-red-500 bg-red-50 focus:ring-red-300"
      : "border-cinza-500 focus-visible:ring-azul"
    }`} value={value} onChange={onChange} required disabled={disabled}/>
        </div>
    )
}

export default Input