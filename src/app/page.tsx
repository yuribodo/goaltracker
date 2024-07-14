import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen">
      <div className="flex justify-between bg-green-300 h-[20vh] w-full shadow-lg ">
        <div className="flex items-center">
          <h1 className="px-4">Gerenciador de Metas</h1>
        </div>
        
        <div className=" flex px-4 space-x-4">
          <div className="flex flex-col items-center justify-center">
            <h2>Todas as Metas</h2>
            <div>3</div>
          </div>
          <div className="flex flex-col items-center justify-center">
            <h2>Em progresso</h2>
            <div>3</div>
          </div>
          <div className="flex flex-col items-center justify-center">
            <h2>Completas</h2>
            <div>3</div>
          </div>          
        </div>
        
      </div>
      
    </div>
  );
}
