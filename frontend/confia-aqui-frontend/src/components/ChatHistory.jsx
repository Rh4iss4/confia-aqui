import React from "react";

const ChatHistory = ({ chatHistory }) => {
  return (
    <>
      {chatHistory.map((msg, i) => (
        <div
          key={i}
          className={`p-2 rounded-lg ${
            msg.type === "user"
              ? "bg-gray-100 text-gray-800 text-right"
              : "bg-blue-100 text-blue-800 text-left"
          }`}
        >
          <span className="text-sm">{msg.message}</span>
        </div>
      ))}
    </>
  );
};

export default ChatHistory;
