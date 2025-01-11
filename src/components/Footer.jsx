export default function Footer() {
    return (
        <footer className="bg-[#382512] text-white py-4">
            <div className="container mx-auto text-center">
                <p>&copy; 2025 - {new Date().getFullYear()} <a href="https://televisionalternativa.com.ar">Televisión Alternativa</a> Todos los derechos reservados.</p>
                <div className="flex justify-center space-x-4 mt-2">
                    <a href="/privacy-policy" className="hover:underline">Política de privacidad</a>
                    <a href="/terms-of-service" className="hover:underline">Términos de servicio</a>
                </div>
            </div>
        </footer>
    );
}
