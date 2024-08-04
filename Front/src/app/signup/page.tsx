"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from 'axios';

const api = process.env.NEXT_PUBLIC_API_LINK || 'http://localhost:8080'; // Certifique-se de definir essa variável no .env

const SignUpPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSignUp = async () => {
    try {
      const response = await axios.post(`${api}/users/`, { username, password, email });
      
      if (response.status === 201) {
        // Cadastro bem-sucedido, você pode definir o status de login aqui se necessário
        localStorage.setItem("isLoggedIn", "true"); // Isso pode ser removido ou ajustado conforme necessário
        router.push("/home");
      } else {
        // Adicione mais detalhes ao erro se possível
        setError("Falha ao criar a conta.");
      }
    } catch (error) {
      // Verifique o tipo de erro para fornecer mensagens mais detalhadas
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || "Ocorreu um erro ao criar a conta.");
      } else {
        console.error("Error signing up:", error);
        setError("Ocorreu um erro ao criar a conta.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="relative flex items-center justify-center w-full max-w-md p-8 mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="relative z-10">
          <h2 className="mb-6 text-3xl font-bold text-gray-900">Sign Up</h2>
          {error && <p className="text-red-600 mb-4">{error}</p>}
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            onClick={handleSignUp}
            className="w-full px-4 py-2 text-white bg-blue-600 rounded-md shadow-md hover:bg-blue-700 transition duration-300"
          >
            Sign Up
          </button>
          <p className="mt-4 text-center text-gray-600">
            Já tem uma conta? <a href="/login" className="text-blue-600 hover:underline">Faça login</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
