import DangerZone from "../components/DangerZone"
import Header from "../components/Header"
import PerfilSection from "../components/PerfilSection"


function Perfil() {

  return (
    <div className="flex flex-col w-full">
    <Header /> 
    <PerfilSection />
    <DangerZone />
    </div>
  )
}
export default Perfil