"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from 'axios';

const api = process.env.NEXT_PUBLIC_API_LINK || 'http://localhost:8080';

const SignUpPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async () => {
    setIsLoading(true);
    setError(null); // Reset error state
    try {
      console.log("Starting signup process...");

      const response = await axios.post(
        `${api}/users/`,
        { username, password, email },
        { timeout: 10000 } // Define o timeout para 10 segundos
      );

      if (response.status === 201) {
        console.log("User created successfully, attempting login...");

        const loginResponse = await axios.post(
          `${api}/auth/login`,
          { username, password }
        );

        if (loginResponse.data.token) {
          console.log("Login successful, storing token and redirecting...");
          localStorage.setItem("token", loginResponse.data.token);
          router.push("/home");
        } else {
          console.log("Login response does not contain token.");
          setError("Falha ao fazer login após o cadastro.");
        }
      } else {
        console.log("Failed to create user.");
        setError("Falha ao criar a conta.");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log("Axios error:", error.response?.data?.message);
        setError(error.response?.data?.message || "Ocorreu um erro ao criar a conta.");
      } else {
        console.error("Error signing up:", error);
        setError("Ocorreu um erro ao criar a conta.");
      }
    } finally {
      setIsLoading(false);
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
            disabled={isLoading}
          >
            {isLoading ? "Signing Up..." : "Sign Up"}
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
