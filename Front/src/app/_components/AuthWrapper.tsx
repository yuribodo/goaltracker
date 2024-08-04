"use client";

import { useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

const AuthWrapper = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuthStatus = () => {
      const token = localStorage.getItem("token");
      if (token) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [loading, isAuthenticated, router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    router.replace("/login");
  };

  if (loading) {
    return <div>Loading...</div>; // Você pode substituir isso por um spinner ou outro componente de carregamento
  }

  if (!isAuthenticated) {
    return null; // Não renderiza nada se não estiver autenticado
  }

  return (
    <>
      {children}
      <button
        onClick={handleLogout}
        className="fixed top-4 right-4 px-4 py-2 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition duration-300"
      >
        Logout
      </button>
    </>
  );
};

export default AuthWrapper;
