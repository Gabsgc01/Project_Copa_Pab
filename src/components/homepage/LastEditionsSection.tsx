import Title from "../Title"
import CardLastEditions from "./CardLastEditions"
import imgLastEdition from "@/assets/imgs/última-edição.png"
import { Link } from "react-router-dom"
import { useTournaments } from '@/contexts/TournamentContext'
import { formatDateBR } from '@/utils/timeUtils'

export default function LastEditionsSection() {
    const { getCompletedTournaments } = useTournaments()

    const completed = getCompletedTournaments()
        .slice()
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 4)

    return (
        <section className="pt-5 bg-contrast-yellow px-6 flex flex-col gap-5">
            <div className="flex justify-between items-center">
                <img src="logo-copa-pab.png" alt="Logo Copa" className="w-16"/>
                <Title textColor="contrast">Últimas Edições</Title>
                <img src="logo-copa-pab.png" alt="Logo Copa" className="w-16"/>
            </div>

            <p className="max-w-4xl mx-auto text-center text-gray-800">
                Confira as últimas edições da Copa PAB: detalhes das partidas, locais e as equipes campeãs — tudo reunido para você relembrar os melhores momentos.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {completed.map((tournament) => (
                    <CardLastEditions
                        key={tournament.id}
                        id={tournament.id}
                        title={tournament.title}
                        imgLastEdition={tournament.imageUrl || imgLastEdition}
                        description={tournament.description}
                        data={formatDateBR(tournament.date)}
                        local={tournament.location}
                        winner={tournament.winner || '—'}
                    />
                ))}
            </div>

            <div className="flex justify-end pb-4">
                <Link to="/torneios-anteriores" className="text-hot-pink font-bold text-lg underline cursor-pointer hover:text-pink-600 transition-colors">
                    Ver Todas as Edições...
                </Link>
            </div>
        </section>
    )
}
