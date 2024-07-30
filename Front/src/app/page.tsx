import Link from "next/link";
import Header from "./(components)/(header)";
import Goals from "./(components)/(goals)";
import AuthWrapper from "./(components)/(AuthWrapper)";

export default function Home() {
    return (
        <AuthWrapper>
            <div className="min-h-screen flex flex-col">
                <Header />
                <Goals />
                <Link href="/goals">
                    <div className="fixed bottom-4 ml-2  h-fit bg-green-600 w-fit cursor-pointer px-4 py-2 rounded-xl shadow-lg">
                        <p className="text-white">Ver Metas Anteriores</p>
                    </div>
                </Link>
            </div>
        </AuthWrapper>
        
    );
}
