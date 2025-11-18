import imagemHero from "../images/imagemHero.png"

function Hero() {
  return (
    <section
  className="relative w-screen min-h-[70vh] md:min-h-[90vh] flex items-center justify-start px-8 pt-16 text-white" style={{backgroundImage: `url(${imagemHero})`, backgroundSize: "cover", backgroundPosition: "center"}}>

  <div className="relative text-start max-w-2xl px-4">
    <h2 className="text-4xl md:text-5xl font-bold mb-4">Passou por um golpe?</h2>
    <p className="text-xl font-normal mb-6">
      Denuncie golpes diretamente aos canais oficiais e ajude as autoridades a combater fraudes de forma segura e eficaz.
    </p>
    <a href="https://www.gov.br/cgu/pt-br/centrais-de-conteudo/campanhas/integridade-publica/denuncias" target="_blank" className="bg-azul hover:opacity-80 text-white hover:text-white px-7 py-4 rounded-2xl font-normal text-lg transition">
      Denunciar golpe
    </a>
  </div>
</section>

  )
}

export default Hero