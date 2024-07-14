import Image from "next/image";
import Header from "./(components)/(header)";
import Goals from "./(components)/(goals)";

export default function Home() {
    return (
        <div className="min-h-screen">
            <Header />
            <div className="flex justify-between">
                <div className="flex space-x-2 py-6 px-6">
                    <div className="flex items-center justify-center cursor-pointer bg-yellow-200 rounded-xl h-[50px] w-[50px] shadow-lg">+</div>
                    <div className="flex items-center">
                        <h1 className="">Nova Meta</h1>
                    </div>
                </div>
                <div className="w-[50vw]">
                    <Goals />
                    
                </div>
            </div>
            <div className="flex ml-6 bg-green-600 w-fit cursor-pointer px-2 rounded-xl shadow-lg mt-[40vh]">
                <p className="p-2">Ver Metas Anteriores</p>
            </div>
        </div>
    );
}
