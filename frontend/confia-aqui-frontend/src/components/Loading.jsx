import React from "react";

const Loading = ({ isLoading }) =>
  isLoading ? (
    <div className="flex justify-center mt-2">
      <span className="animate-pulse text-blue-500">Carregando...</span>
    </div>
  ) : null;

export default Loading;
