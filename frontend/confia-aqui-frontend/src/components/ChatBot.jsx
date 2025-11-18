import React, { useState, useEffect, useRef } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import ChatHistory from "./ChatHistory";
import Loading from "./Loading";

const ChatBot = () => {
  const [userInput, setUserInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const modelRef = useRef(null);

  useEffect(() => {
    const saved = sessionStorage.getItem("chatHistory");
    if (saved) setChatHistory(JSON.parse(saved));
  }, []);

  useEffect(() => {
    sessionStorage.setItem("chatHistory", JSON.stringify(chatHistory));
  }, [chatHistory]);

  useEffect(() => {
    try {
      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
      modelRef.current = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    } catch (e) {
      console.warn("Erro ao inicializar GoogleGenerativeAI", e);
    }
  }, []);

  const sendMessage = async () => {
    if (!userInput.trim()) return;
    setIsLoading(true);
    setChatHistory((prev) => [...prev, { type: "user", message: userInput }]);

    try {
      const model = modelRef.current;
      let result = await model.generateContent(userInput);

      let botText =
        result?.response?.text?.() ||
        result?.response?.outputText ||
        result?.outputText ||
        "(sem resposta)";

      setChatHistory((prev) => [...prev, { type: "bot", message: botText }]);
    } catch (err) {
      console.error(err);
      setChatHistory((prev) => [...prev, { type: "bot", message: "(erro ao enviar)" }]);
    } finally {
      setUserInput("");
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setChatHistory([]);
    sessionStorage.removeItem("chatHistory");
  };

  return (
    <div className="bg-white border rounded-lg shadow-xl p-4 w-80 h-[480px] flex flex-col">
      <h2 className="text-lg font-semibold text-center mb-2">ChatBot 🤖</h2>

      <div className="flex-1 overflow-y-auto space-y-2 mb-2 p-2 border rounded-md">
        <ChatHistory chatHistory={chatHistory} />
        <Loading isLoading={isLoading} />
      </div>

      <div className="flex mt-auto">
        <input
          type="text"
          className="flex-grow border p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="Digite sua mensagem..."
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              if (!isLoading) sendMessage();
            }
          }}
        />
        <button
          onClick={sendMessage}
          disabled={isLoading}
          className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Enviar
        </button>
      </div>

      <button
        onClick={clearChat}
        className="mt-3 w-full bg-gray-300 hover:bg-gray-400 rounded-lg py-1 text-sm text-gray-800"
      >
        Limpar Chat
      </button>
    </div>
  );
};

export default ChatBot;
