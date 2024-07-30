"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Certifique-se de importar do next/navigation

const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      const isLoggedIn = localStorage.getItem("isLoggedIn");

      if (!isLoggedIn) {
        router.replace("/login");
      }
    }
  }, [isMounted, router]);

  if (!isMounted) {
    return null;
  }

  return <>{children}</>;
};

export default AuthWrapper;
