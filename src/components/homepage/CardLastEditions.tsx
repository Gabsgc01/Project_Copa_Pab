import Title from "../Title";
import { IoEnterOutline } from "react-icons/io5";

interface CardLastEditionsProps {
    title: string;
    imgLastEdition: string;
    description: string;
    data: string;
    local: string;
    winner: string;
}

export default function CardLastEditions({
    title,
    imgLastEdition,
    description,
    data,
    local,
    winner,
}: CardLastEditionsProps) {
    return (
        <div className="flex flex-col items-center gap-4">
            <Title textColor="contrast" size="sm" font="sm">🏆 {title}</Title>
            <div className="bg-pink-light rounded-xl relative overflow-hidden w-full max-w-sm border-2 border-hot-pink">
                <img src={imgLastEdition} alt="Imagem Copa Últimas Edições" className="w-full rounded-t-lg" />
                <article className="p-4 flex flex-col gap-2">
                    <p className="text-justify text-base">{description}</p>
                    <p className="text-sm font-medium">📅 Data: {data}</p>
                    <p className="text-sm font-medium">📍 Local: {local}</p>
                    <p className="text-sm font-medium">🥇 Campeãs: {winner}</p>
                </article>
                <IoEnterOutline className="absolute bottom-3 right-3 text-[var(--color-hot-pink)] text-3xl cursor-pointer" />
            </div>
        </div>
    )
}
