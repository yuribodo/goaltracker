"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
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

  if (loading) {
    return <div>Loading...</div>; // Você pode substituir isso por um spinner ou outro componente de carregamento
  }

  if (!isAuthenticated) {
    return null; // Não renderiza nada se não estiver autenticado
  }

  return <>{children}</>;
};

export default AuthWrapper;
