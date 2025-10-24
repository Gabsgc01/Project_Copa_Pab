import Title from "../Title"
import CardLastEditions from "./CardLastEditions"
import imgLastEdition from "@/assets/imgs/última-edição.png"
import { Link } from "react-router-dom"

export default function LastEditionsSection() {
    return (
        <section className="pt-5 bg-contrast-yellow px-6 flex flex-col gap-5">
            <div className="flex justify-between items-center">
                <img src="logo-copa-pab.png" alt="Logo Copa" className="w-16"/>
                <Title textColor="contrast">Últimas Edições</Title>
                <img src="logo-copa-pab.png" alt="Logo Copa" className="w-16"/>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <CardLastEditions 
                    title="Copa Passa a Bola 2024"
                    imgLastEdition={imgLastEdition}
                    description="A Copa Passa a Bola de 2024 foi simplesmente inesquecível. Realizada no Centro Esportivo de Itaquera, em São Paulo, reunimos 8 times formados por mulheres incríveis, que deram um verdadeiro show de garra, união e talento dentro e fora das quatro linhas..."
                    data="14 de abril de 2024"
                    local="Centro Esportivo de Itaquera - São Paulo/SP"
                    winner="Estrelas da Zona Leste"
                />
                <CardLastEditions 
                    title="Copa Passa a Bola 2024"
                    imgLastEdition={imgLastEdition}
                    description="A Copa Passa a Bola de 2024 foi simplesmente inesquecível. Realizada no Centro Esportivo de Itaquera, em São Paulo, reunimos 8 times formados por mulheres incríveis, que deram um verdadeiro show de garra, união e talento dentro e fora das quatro linhas..."
                    data="14 de abril de 2024"
                    local="Centro Esportivo de Itaquera - São Paulo/SP"
                    winner="Estrelas da Zona Leste"
                />
                <CardLastEditions 
                    title="Copa Passa a Bola 2024"
                    imgLastEdition={imgLastEdition}
                    description="A Copa Passa a Bola de 2024 foi simplesmente inesquecível. Realizada no Centro Esportivo de Itaquera, em São Paulo, reunimos 8 times formados por mulheres incríveis, que deram um verdadeiro show de garra, união e talento dentro e fora das quatro linhas..."
                    data="14 de abril de 2024"
                    local="Centro Esportivo de Itaquera - São Paulo/SP"
                    winner="Estrelas da Zona Leste"
                />
                <CardLastEditions 
                    title="Copa Passa a Bola 2024"
                    imgLastEdition={imgLastEdition}
                    description="A Copa Passa a Bola de 2024 foi simplesmente inesquecível. Realizada no Centro Esportivo de Itaquera, em São Paulo, reunimos 8 times formados por mulheres incríveis, que deram um verdadeiro show de garra, união e talento dentro e fora das quatro linhas..."
                    data="14 de abril de 2024"
                    local="Centro Esportivo de Itaquera - São Paulo/SP"
                    winner="Estrelas da Zona Leste"
                />
            </div>            <div className="flex justify-end pb-4">
                <Link to="/torneios-anteriores" className="text-hot-pink font-bold text-lg underline cursor-pointer hover:text-pink-600 transition-colors">
                    Ver Todas as Edições...
                </Link>
            </div>
        </section>
    )
}
