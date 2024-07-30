// components/ProtectedRoute.tsx
import { ReactNode } from "react";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  return (
    <>
      <SignedOut>
        <div className="flex flex-col items-center justify-center min-h-screen">
          <h1 className="text-2xl mb-4">Você precisa estar logado para acessar esta página</h1>
          <SignInButton mode="modal">
            <button className="bg-blue-500 text-white px-4 py-2 rounded">Entrar</button>
          </SignInButton>
        </div>
      </SignedOut>
      <SignedIn>
        {children}
      </SignedIn>
    </>
  );
};

export default ProtectedRoute;
