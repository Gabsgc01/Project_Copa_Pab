import { Link } from 'react-router-dom'
import { FaCalendarAlt, FaSearch, FaInfoCircle } from 'react-icons/fa'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import CardUpcomingTournament from '@/components/tournaments/CardUpcomingTournament'
import NavigationHeader from '@/components/NavigationHeader'
import Footer from '@/components/Footer'
import { useAuth } from '@/contexts/AuthContext'
import { useTournaments } from '@/contexts/TournamentContext'
import { useState } from 'react'

const UpcomingTournaments = () => {
  const { isLoggedIn } = useAuth()
  const { getPublicTournaments } = useTournaments()
  const [searchTerm, setSearchTerm] = useState('')

  // Usar torneios do contexto
  const tournaments = getPublicTournaments().map(tournament => ({
    ...tournament,
    date: new Date(tournament.date).toLocaleDateString('pt-BR'),
    registrationDeadline: new Date(tournament.registrationDeadline).toLocaleDateString('pt-BR')
  }))

  const filteredTournaments = tournaments.filter(tournament =>
    tournament.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tournament.location.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-pink-light">
      {/* Header */}
      <NavigationHeader />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-hot-pink to-pink-light-1 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4">
            Próximos Torneios
          </h1>
          <p className="text-xl mb-6 max-w-3xl mx-auto leading-relaxed">
            Descubra as próximas competições da Copa PAB e garante sua vaga! 
            Não perca a oportunidade de fazer parte da maior celebração do futebol feminino.
          </p>
          <div className="flex items-center gap-3 text-lg">
            <FaCalendarAlt className="text-contrast-yellow" />
            <span>Temporada 2025 - Inscrições Abertas!</span>
          </div>
        </div>
      </div>

      {/* Login Alert for Non-Authenticated Users */}
      {!isLoggedIn && (
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg">
            <div className="flex items-center">
              <FaInfoCircle className="text-blue-400 mr-3" />
              <div>
                <p className="text-blue-800 font-medium">
                  Para se inscrever nos torneios, você precisa ter uma conta.
                </p>
                <div className="mt-2 flex gap-3">
                  <Button size="sm" asChild>
                    <Link to="/cadastrar">Criar Conta Grátis</Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/login">Já tenho conta</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search Section */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar por nome do torneio ou local..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="text-gray-600 font-medium">
              {filteredTournaments.length} torneio(s) encontrado(s)
            </div>
          </div>
        </div>

        {/* Tournament Grid */}
        {filteredTournaments.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
            {filteredTournaments.map((tournament) => (
              <CardUpcomingTournament key={tournament.id} {...tournament} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-600 mb-2">
              Nenhum torneio encontrado
            </h3>
            <p className="text-gray-500">
              Tente ajustar sua busca ou volte mais tarde para ver novos torneios.
            </p>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-16 bg-white rounded-lg shadow-md p-8 text-center">
          <h3 className="text-3xl font-bold text-gray-800 mb-4">
            Não encontrou o torneio ideal?
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Fique por dentro das novidades! Siga nossas redes sociais e seja a primeira a saber sobre novos torneios e competições.
          </p>          <div className="flex justify-center gap-4">
            <Button variant="default" asChild>
              <a href="mailto:contato@copa-pab.com">
                Entre em Contato
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a href="mailto:contato@copa-pab.com?subject=Newsletter Copa PAB">
                Newsletter
              </a>
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default UpcomingTournaments