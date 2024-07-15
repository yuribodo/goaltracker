import Link from "next/link";
import Header from "./(components)/(header)";
import Goals from "./(components)/(goals)";

export default function Home() {
    return (
        <div className="min-h-screen">
            <Header />
            <Goals />
            <Link href="/goals">
                <div className="flex ml-6 bg-green-600 w-fit cursor-pointer px-2 rounded-xl shadow-lg mt-[25vh]">
                    <p className="p-2">Ver Metas Anteriores</p>
                </div>
            </Link>
        </div>
    );
}
