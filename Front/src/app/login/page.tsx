"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = () => {
    if (username === "user" && password === "password") {
      localStorage.setItem("isLoggedIn", "true");
      router.push("/");
    } else {
      alert("Credenciais inválidas!");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="relative flex items-center justify-center w-full max-w-md p-8 mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="relative z-10">
          <h2 className="mb-6 text-3xl font-bold text-gray-900">Login</h2>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 mb-6 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
          />
          <button
            onClick={handleLogin}
            className="w-full px-4 py-2 text-white bg-blue-600 rounded-md shadow-md hover:bg-blue-700 transition duration-300"
          >
            Login
          </button>
          <p className="mt-4 text-center text-gray-600">
            Não tem uma conta? <a href="/signup" className="text-blue-600 hover:underline">Registre-se</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
