export default function NavBar() {
    return (
        <nav className="fixed z-30 flex justify-center items-center w-full m-2">
            <div className="bg-[#382512cc] text-white p-5 rounded-full text-center">
                <a href="/" className="text-lg font-bold hover:underline">Inicio</a>
                <a href="/#about" className="text-lg font-bold hover:underline ml-4">Nosotros</a>
                <a href="/carta" className="text-lg font-bold hover:underline ml-4">Carta</a>
                <a href="https://maps.app.goo.gl/wPrZH3xYfvGNooM57" className="text-lg font-bold hover:underline ml-4">Ubicación</a>
            </div>
        </nav>
    );
}
