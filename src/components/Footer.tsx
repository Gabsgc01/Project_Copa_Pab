import { Link } from "react-router-dom";
import Title from "./Title";
import { FaInstagram, FaWhatsapp } from "react-icons/fa6";
import { BiLogoGmail } from "react-icons/bi";

export default function Footer() {
    return (
        <footer className="grid grid-cols-1 items-start md:grid-cols-2 lg:grid-cols-3 bg-contrast-yellow p-6 gap-6 border-t-2 border-hot-pink">
            <div className="flex flex-col md:flex-row justify-center items-center gap-2 md:col-span-2 lg:col-span-1">
                <img src="logo-copa-pab.png" alt="Logo Copa PAB" className="w-20 md:w-16 lg:w-20"/>
                <article className="text-center md:text-left">
                    <Title textColor="contrast">Copa Passa a Bola</Title>
                    <Title textColor="contrast" size="sm" font="special">Futebol é para Todas.</Title>
                </article>
            </div>
            <div className="flex flex-col items-center">
                <Title textColor="contrast">Links Rápidos</Title>
                <nav className="flex flex-col items-start">
                    <Link to="/" className="underline cursor-pointer text-gray-contrast font-special font-medium hover:text-hot-pink hover:font-bold">Início</Link>
                    <Link to="/torneios" className="underline cursor-pointer text-gray-contrast font-special font-medium hover:text-hot-pink hover:font-bold">Próximos Torneios</Link>
                    <Link to="/chaveamentos" className="underline cursor-pointer text-gray-contrast font-special font-medium hover:text-hot-pink hover:font-bold">Chaveamentos</Link>
                    <Link to="/login" className="underline cursor-pointer text-gray-contrast font-special font-medium hover:text-hot-pink hover:font-bold">Fazer Login</Link>
                    <Link to="/cadastrar" className="underline cursor-pointer text-gray-contrast font-special font-medium hover:text-hot-pink hover:font-bold">Cadastrar-se</Link>
                    <Link to="/dashboard" className="underline cursor-pointer text-gray-contrast font-special font-medium hover:text-hot-pink hover:font-bold">Minha Conta</Link>
                    <Link to="/admin/login" className="underline cursor-pointer text-gray-500 font-special text-xs hover:text-hot-pink hover:font-bold">Painel Admin</Link>
                </nav>
            </div>
            <div className="flex flex-col items-center">
                <Title textColor="contrast">Nossas Redes</Title>
                <div className="flex">
                    <a href=""><FaInstagram className="text-hot-pink w-20 h-20"/></a>
                    <a href=""><FaWhatsapp className="text-hot-pink w-20 h-20"/></a>
                    <a href=""><BiLogoGmail className="text-hot-pink w-20 h-20"/></a>
                </div>
            </div>
        </footer>
    )
}
