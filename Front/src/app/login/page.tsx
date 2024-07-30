// src/app/login/page.tsx

"use client"; // Adicione esta linha para marcar o componente como Client Component

import { useState } from "react";
import { useRouter } from "next/navigation"; // Use o hook correto para o App Router

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = () => {
    // Simulação de autenticação
    if (username === "user" && password === "password") {
      localStorage.setItem("isLoggedIn", "true");
      router.push("/"); // Navega para a página inicial após login
    } else {
      alert("Credenciais inválidas!");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="p-8 bg-white rounded-lg shadow-md">
        <h2 className="mb-4 text-2xl font-semibold">Login</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-4 py-2 mb-2 border rounded-md"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 mb-4 border rounded-md"
        />
        <button
          onClick={handleLogin}
          className="w-full px-4 py-2 text-white bg-blue-600 rounded-md"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
