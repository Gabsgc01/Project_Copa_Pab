import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import { FaCalendarAlt, FaMapMarkerAlt, FaTrophy, FaUsers, FaClock, FaLock } from "react-icons/fa";
import { useAuth } from "@/contexts/AuthContext";

interface CardUpcomingTournamentProps {
    id: string;
    title: string;
    description: string;
    date: string;
    registrationDeadline: string;
    location: string;
    maxTeams: number;
    registeredTeams: number;
    prize: string;
    imageUrl?: string;
    isRegistrationOpen: boolean;
}

export default function CardUpcomingTournament({
    id,
    title,
    description,
    date,
    registrationDeadline,
    location,
    maxTeams,
    registeredTeams,
    prize,
    imageUrl,
    isRegistrationOpen
}: CardUpcomingTournamentProps) {
    const { isLoggedIn } = useAuth();
    const spotsLeft = maxTeams - registeredTeams;
    const isAlmostFull = spotsLeft <= 5;

    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-gray-200 hover:border-hot-pink transition-colors duration-300">
            {imageUrl && (
                <div className="relative h-48 overflow-hidden">
                    <img 
                        src={imageUrl} 
                        alt={title} 
                        className="w-full h-full object-cover"
                    />
                    {isAlmostFull && (
                        <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                            Últimas vagas!
                        </div>
                    )}
                </div>
            )}
            
            <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-3">
                    🏆 {title}
                </h3>
                
                <p className="text-gray-600 text-justify mb-4 leading-relaxed">
                    {description}
                </p>
                
                <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 text-sm">
                        <FaCalendarAlt className="text-hot-pink" />
                        <span><strong>Data do torneio:</strong> {date}</span>
                    </div>
                    
                    <div className="flex items-center gap-3 text-sm">
                        <FaClock className="text-hot-pink" />
                        <span><strong>Inscrições até:</strong> {registrationDeadline}</span>
                    </div>
                    
                    <div className="flex items-center gap-3 text-sm">
                        <FaMapMarkerAlt className="text-hot-pink" />
                        <span><strong>Local:</strong> {location}</span>
                    </div>
                    
                    <div className="flex items-center gap-3 text-sm">
                        <FaUsers className="text-hot-pink" />
                        <span><strong>Vagas:</strong> {registeredTeams}/{maxTeams} times</span>
                        {spotsLeft > 0 && (
                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                isAlmostFull ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                            }`}>
                                {spotsLeft} vagas restantes
                            </span>
                        )}
                    </div>
                    
                    <div className="flex items-center gap-3 text-sm">
                        <FaTrophy className="text-hot-pink" />
                        <span><strong>Premiação:</strong> {prize}</span>
                    </div>
                </div>
                
                <div className="flex gap-3">
                    {isRegistrationOpen ? (
                        isLoggedIn ? (
                            <Button 
                                className="flex-1 font-bold" 
                                variant="default"
                                asChild
                                disabled={spotsLeft === 0}
                            >
                                <Link to={`/inscricao/${id}`}>
                                    {spotsLeft === 0 ? 'Esgotado' : 'Inscrever-se'}
                                </Link>
                            </Button>
                        ) : (
                            <Button 
                                className="flex-1 font-bold" 
                                variant="outline"
                                asChild
                            >
                                <Link to="/login" className="flex items-center gap-2">
                                    <FaLock size={16} />
                                    Faça login para se inscrever
                                </Link>
                            </Button>
                        )
                    ) : (
                        <Button 
                            className="flex-1 font-bold" 
                            variant="outline"
                            disabled
                        >
                            Inscrições Encerradas
                        </Button>
                    )}
                    
                    <Button 
                        variant="outline" 
                        size="default"
                        asChild
                    >
                        <Link to={`/torneio/${id}`}>
                            Ver Detalhes
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}