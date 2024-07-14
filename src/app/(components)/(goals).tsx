export default function Goals() {
    return (
        <div className="grid grid-cols-2 gap-4">
            <div className="px-6 py-6 bg-red-500">
                <h2 className="font-bold">Meta 01</h2>
                <h3>3/5 itens</h3>
            </div>
            <div className="px-6 py-6 bg-red-500">
                <h2 className="font-bold">Meta 02</h2>
                <h3>4/5 itens</h3>
            </div>
            <div className="px-6 py-6 bg-red-500">
                <h2 className="font-bold">Meta 03</h2>
                <h3>2/5 itens</h3>
            </div>
            <div className="px-6 py-6 bg-red-500">
                <h2 className="font-bold">Meta 04</h2>
                <h3>5/5 itens</h3>
            </div>
            {/* Adicione mais metas conforme necessário */}
        </div>
    );
}
