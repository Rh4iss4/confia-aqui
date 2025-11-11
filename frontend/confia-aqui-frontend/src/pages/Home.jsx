import Header from "../components/Header"
import Hero from "../components/Hero"
import CardTeste from "../components/CardTeste"
import FAQ from "../components/FAQ"
import ChatBot from "../components/ChatBot"

function Home() {
  return (
    <div className="flex flex-col min-h-screen relative">
      <Header />
      <Hero />
      <CardTeste />
      <FAQ />

      <div className="fixed bottom-4 right-4 z-50">
        <ChatBot />
      </div>
    </div>
  )
}

export default Home;
