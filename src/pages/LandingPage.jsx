import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

function Content() {
    return (
        <>
            <div id="about" className="flex flex-col md:flex-row justify-center items-center p-8 space-y-4 md:space-y-0 md:space-x-4">
                <img src="/AboutUs.jpg" className="w-full md:w-1/4 h-auto rounded-lg shadow-lg" />
                <div className="text-lg space-y-4 text-gray-800 w-full md:w-1/2">
                    <h3 className="text-3xl text-center font-bold text-white">Sobre nosotros</h3>
                    <p>
                        Somos un restaurante especializado en comida italiana y mediterránea, con más de 10 años de experiencia. Nuestro objetivo es ofrecer a nuestros clientes
                        una experiencia gastronómica única, con platos de alta calidad y un servicio excepcional.
                    </p>
                </div>
            </div>
            <div className="flex flex-col md:flex-row flex-wrap justify-center items-center p-8 space-y-4 md:space-y-0 md:space-x-4">
                <div className="text-lg text-gray-800 w-full md:w-1/2">
                    <h3 className="text-3xl text-center font-bold text-white">Nuestros platos</h3>
                    <p className="my-4">
                        En nuestro menú encontrarás una amplia variedad de platos italianos y mediterráneos, elaborados con ingredientes frescos y de alta calidad. Desde
                        pastas y pizzas, hasta carnes y pescados, tenemos opciones para todos los gustos.
                    </p>
                    <a href="/carta" className="px-4 py-2 bg-[#382512] text-white">Ver carta</a>
                </div>
                <img src="/OurDishes.jpg" className="w-full md:w-1/4 h-auto rounded-lg shadow-lg" />
            </div>
        </>
    );
}

function Galery() {
    const images = [
        "/galery/1.jpg",
        "/galery/2.jpg",
        "/galery/3.jpg",
        "/galery/4.jpg",
        "/galery/5.jpg",
        "/galery/6.jpg"
    ];
    return (
        <div className="p-8">
            <h3 className="text-3xl text-center font-bold text-white">Galería</h3>
            <p className="text-gray-800 text-center mb-4">Explora nuestra galería de imágenes para conocer más sobre nuestro restaurante y nuestros platos.</p>
            <div className="flex flex-col md:flex-row flex-wrap justify-center items-center space-y-4 md:space-y-2 md:space-x-4">
                {images.map((image, index) => (
                    <img key={index} src={image} className="w-full md:w-1/4 h-auto rounded-lg shadow-lg" />
                ))}
            </div>
        </div>
    );
}

export default function LandingPage() {
    return (
        <div className="bg-[#a37d51]">
            <NavBar />
            <div className="flex flex-col items-center space-y-4 justify-center min-h-screen coffee-bg">
                <h1 className="text-4xl font-bold text-white text-center">Bienvenido a nuestro restaurante</h1>
                <p className="mt-4 text-lg text-gray-100">Descubre nuestros platos y servicios</p>
                <a href="/carta" className="bg-orange-500 text-lg px-4 py-2 font-medium hover:bg-orange-400">Carta</a>
            </div>
            <Content />
            <Galery />
            <Footer />
        </div>
    );
}
