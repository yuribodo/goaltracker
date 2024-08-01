"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkLoginStatus = () => {
      const loggedInStatus = localStorage.getItem("isLoggedIn");
      setIsLoggedIn(loggedInStatus === "true");
    };

    checkLoginStatus();
  }, []);

  useEffect(() => {
    if (isLoggedIn === false) {
      router.replace("/login");
    }
  }, [isLoggedIn, router]);

  if (isLoggedIn === null) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};

export default AuthWrapper;
