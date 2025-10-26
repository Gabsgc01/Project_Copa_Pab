// Dados de exemplo para popular o localStorage
import type { Tournament } from '@/contexts/TournamentContext'

export interface Player {
  id: string
  name: string
  position: string
  age: number
  rg: string
  cpf: string
  photo?: string
  isValidated?: boolean
}

export interface Team {
  id: string
  name: string
  email: string
  password: string
  phone: string
  captain: string
  captainPhone: string
  city: string
  state: string
  foundationYear: number
  colors: string
  description: string
  logo?: string
  players: Player[]
  createdAt: string
  role?: 'user'
  enrolledTournaments?: string[]
}

// Jogadoras de exemplo
const samplePlayers: Player[] = [
  // Time Estrelas do Futebol
  { id: 'player_1', name: 'Maria Silva', position: 'Goleira', age: 25, rg: '12.345.678-9', cpf: '123.456.789-00', isValidated: true },
  { id: 'player_2', name: 'Ana Costa', position: 'Zagueira', age: 23, rg: '12.345.679-0', cpf: '123.456.790-11', isValidated: true },
  { id: 'player_3', name: 'Carla Santos', position: 'Meio-campo', age: 22, rg: '12.345.680-1', cpf: '123.456.791-22', isValidated: true },
  { id: 'player_4', name: 'Paula Oliveira', position: 'Atacante', age: 24, rg: '12.345.681-2', cpf: '123.456.792-33', isValidated: true },
  { id: 'player_5', name: 'Julia Ferreira', position: 'Meio-campo', age: 21, rg: '12.345.682-3', cpf: '123.456.793-44', isValidated: true },
  { id: 'player_6', name: 'Beatriz Lima', position: 'Zagueira', age: 26, rg: '12.345.683-4', cpf: '123.456.794-55', isValidated: true },
  { id: 'player_7', name: 'Fernanda Rocha', position: 'Atacante', age: 20, rg: '12.345.684-5', cpf: '123.456.795-66', isValidated: true },
  { id: 'player_8', name: 'Camila Souza', position: 'Lateral', age: 22, rg: '12.345.685-6', cpf: '123.456.796-77', isValidated: true },
  { id: 'player_9', name: 'Larissa Alves', position: 'Meio-campo', age: 23, rg: '12.345.686-7', cpf: '123.456.797-88', isValidated: true },
  { id: 'player_10', name: 'Gabriela Martins', position: 'Atacante', age: 25, rg: '12.345.687-8', cpf: '123.456.798-99', isValidated: true },
  { id: 'player_11', name: 'Rafaela Pereira', position: 'Lateral', age: 24, rg: '12.345.688-9', cpf: '123.456.799-00', isValidated: true },

  // Time Força Feminina
  { id: 'player_12', name: 'Isabela Barbosa', position: 'Goleira', age: 27, rg: '22.345.678-9', cpf: '223.456.789-00', isValidated: true },
  { id: 'player_13', name: 'Letícia Gomes', position: 'Zagueira', age: 24, rg: '22.345.679-0', cpf: '223.456.790-11', isValidated: true },
  { id: 'player_14', name: 'Amanda Ribeiro', position: 'Meio-campo', age: 21, rg: '22.345.680-1', cpf: '223.456.791-22', isValidated: true },
  { id: 'player_15', name: 'Vitória Cardoso', position: 'Atacante', age: 23, rg: '22.345.681-2', cpf: '223.456.792-33', isValidated: true },
  { id: 'player_16', name: 'Sophia Mendes', position: 'Meio-campo', age: 22, rg: '22.345.682-3', cpf: '223.456.793-44', isValidated: true },
  { id: 'player_17', name: 'Helena Castro', position: 'Zagueira', age: 25, rg: '22.345.683-4', cpf: '223.456.794-55', isValidated: true },
  { id: 'player_18', name: 'Alice Nunes', position: 'Atacante', age: 20, rg: '22.345.684-5', cpf: '223.456.795-66', isValidated: true },
  { id: 'player_19', name: 'Laura Correia', position: 'Lateral', age: 24, rg: '22.345.685-6', cpf: '223.456.796-77', isValidated: true },
  { id: 'player_20', name: 'Manuela Dias', position: 'Meio-campo', age: 23, rg: '22.345.686-7', cpf: '223.456.797-88', isValidated: true },
  { id: 'player_21', name: 'Yasmin Teixeira', position: 'Atacante', age: 22, rg: '22.345.687-8', cpf: '223.456.798-99', isValidated: true },
  { id: 'player_22', name: 'Eduarda Lopes', position: 'Lateral', age: 21, rg: '22.345.688-9', cpf: '223.456.799-00', isValidated: true },

  // Time Guerreiras FC
  { id: 'player_23', name: 'Bruna Araújo', position: 'Goleira', age: 26, rg: '32.345.678-9', cpf: '323.456.789-00', isValidated: true },
  { id: 'player_24', name: 'Giovanna Moreira', position: 'Zagueira', age: 23, rg: '32.345.679-0', cpf: '323.456.790-11', isValidated: true },
  { id: 'player_25', name: 'Aline Vieira', position: 'Meio-campo', age: 25, rg: '32.345.680-1', cpf: '323.456.791-22', isValidated: true },
  { id: 'player_26', name: 'Bianca Freitas', position: 'Atacante', age: 22, rg: '32.345.681-2', cpf: '323.456.792-33', isValidated: true },
  { id: 'player_27', name: 'Mariana Pinto', position: 'Meio-campo', age: 24, rg: '32.345.682-3', cpf: '323.456.793-44', isValidated: true },
  { id: 'player_28', name: 'Natália Reis', position: 'Zagueira', age: 21, rg: '32.345.683-4', cpf: '323.456.794-55', isValidated: true },
  { id: 'player_29', name: 'Débora Campos', position: 'Atacante', age: 23, rg: '32.345.684-5', cpf: '323.456.795-66', isValidated: true },
  { id: 'player_30', name: 'Renata Cunha', position: 'Lateral', age: 22, rg: '32.345.685-6', cpf: '323.456.796-77', isValidated: true },
  { id: 'player_31', name: 'Cristina Morais', position: 'Meio-campo', age: 24, rg: '32.345.686-7', cpf: '323.456.797-88', isValidated: true },
  { id: 'player_32', name: 'Priscila Ramos', position: 'Atacante', age: 25, rg: '32.345.687-8', cpf: '323.456.798-99', isValidated: true },
  { id: 'player_33', name: 'Vanessa Silva', position: 'Lateral', age: 23, rg: '32.345.688-9', cpf: '323.456.799-00', isValidated: true },

  // Time Amazonas United
  { id: 'player_34', name: 'Tatiana Machado', position: 'Goleira', age: 28, rg: '42.345.678-9', cpf: '423.456.789-00', isValidated: true },
  { id: 'player_35', name: 'Monique Farias', position: 'Zagueira', age: 24, rg: '42.345.679-0', cpf: '423.456.790-11', isValidated: true },
  { id: 'player_36', name: 'Jéssica Torres', position: 'Meio-campo', age: 22, rg: '42.345.680-1', cpf: '423.456.791-22', isValidated: true },
  { id: 'player_37', name: 'Patrícia Melo', position: 'Atacante', age: 26, rg: '42.345.681-2', cpf: '423.456.792-33', isValidated: true },
  { id: 'player_38', name: 'Simone Guedes', position: 'Meio-campo', age: 23, rg: '42.345.682-3', cpf: '423.456.793-44', isValidated: true },
  { id: 'player_39', name: 'Cláudia Fonseca', position: 'Zagueira', age: 25, rg: '42.345.683-4', cpf: '423.456.794-55', isValidated: true },
  { id: 'player_40', name: 'Adriana Siqueira', position: 'Atacante', age: 21, rg: '42.345.684-5', cpf: '423.456.795-66', isValidated: true },
  { id: 'player_41', name: 'Luciana Batista', position: 'Lateral', age: 24, rg: '42.345.685-6', cpf: '423.456.796-77', isValidated: true },
  { id: 'player_42', name: 'Roberta Viana', position: 'Meio-campo', age: 22, rg: '42.345.686-7', cpf: '423.456.797-88', isValidated: true },
  { id: 'player_43', name: 'Daniela Azevedo', position: 'Atacante', age: 25, rg: '42.345.687-8', cpf: '423.456.798-99', isValidated: true },
  { id: 'player_44', name: 'Sandra Nogueira', position: 'Lateral', age: 27, rg: '42.345.688-9', cpf: '423.456.799-00', isValidated: true },

  // Time Panteras do Sul
  { id: 'player_45', name: 'Michele Brandão', position: 'Goleira', age: 24, rg: '52.345.678-9', cpf: '523.456.789-00', isValidated: true },
  { id: 'player_46', name: 'Elaine Duarte', position: 'Zagueira', age: 26, rg: '52.345.679-0', cpf: '523.456.790-11', isValidated: true },
  { id: 'player_47', name: 'Rosana Xavier', position: 'Meio-campo', age: 23, rg: '52.345.680-1', cpf: '523.456.791-22', isValidated: true },
  { id: 'player_48', name: 'Marta Coelho', position: 'Atacante', age: 25, rg: '52.345.681-2', cpf: '523.456.792-33', isValidated: true },
  { id: 'player_49', name: 'Viviane Passos', position: 'Meio-campo', age: 22, rg: '52.345.682-3', cpf: '523.456.793-44', isValidated: true },
  { id: 'player_50', name: 'Angélica Borges', position: 'Zagueira', age: 24, rg: '52.345.683-4', cpf: '523.456.794-55', isValidated: true },
  { id: 'player_51', name: 'Silvia Miranda', position: 'Atacante', age: 21, rg: '52.345.684-5', cpf: '523.456.795-66', isValidated: true },
  { id: 'player_52', name: 'Regina Esteves', position: 'Lateral', age: 27, rg: '52.345.685-6', cpf: '523.456.796-77', isValidated: true },
  { id: 'player_53', name: 'Karina Monteiro', position: 'Meio-campo', age: 23, rg: '52.345.686-7', cpf: '523.456.797-88', isValidated: true },
  { id: 'player_54', name: 'Tânia Leite', position: 'Atacante', age: 24, rg: '52.345.687-8', cpf: '523.456.798-99', isValidated: true },
  { id: 'player_55', name: 'Célia Oliveira', position: 'Lateral', age: 26, rg: '52.345.688-9', cpf: '523.456.799-00', isValidated: true },

  // Time Águias Douradas
  { id: 'player_56', name: 'Luciene Tavares', position: 'Goleira', age: 25, rg: '62.345.678-9', cpf: '623.456.789-00', isValidated: true },
  { id: 'player_57', name: 'Graziela Nascimento', position: 'Zagueira', age: 22, rg: '62.345.679-0', cpf: '623.456.790-11', isValidated: true },
  { id: 'player_58', name: 'Solange Antunes', position: 'Meio-campo', age: 24, rg: '62.345.680-1', cpf: '623.456.791-22', isValidated: true },
  { id: 'player_59', name: 'Valéria Moura', position: 'Atacante', age: 23, rg: '62.345.681-2', cpf: '623.456.792-33', isValidated: true },
  { id: 'player_60', name: 'Leila Barros', position: 'Meio-campo', age: 26, rg: '62.345.682-3', cpf: '623.456.793-44', isValidated: true },
  { id: 'player_61', name: 'Fátima Macedo', position: 'Zagueira', age: 21, rg: '62.345.683-4', cpf: '623.456.794-55', isValidated: true },
  { id: 'player_62', name: 'Neusa Paiva', position: 'Atacante', age: 25, rg: '62.345.684-5', cpf: '623.456.795-66', isValidated: true },
  { id: 'player_63', name: 'Márcia Sales', position: 'Lateral', age: 24, rg: '62.345.685-6', cpf: '623.456.796-77', isValidated: true },
  { id: 'player_64', name: 'Vera Sampaio', position: 'Meio-campo', age: 22, rg: '62.345.686-7', cpf: '623.456.797-88', isValidated: true },
  { id: 'player_65', name: 'Lúcia Carvalho', position: 'Atacante', age: 27, rg: '62.345.687-8', cpf: '623.456.798-99', isValidated: true },
  { id: 'player_66', name: 'Glória Dantas', position: 'Lateral', age: 23, rg: '62.345.688-9', cpf: '623.456.799-00', isValidated: true },

  // Time Tigres do Norte
  { id: 'player_67', name: 'Francisca Medeiros', position: 'Goleira', age: 29, rg: '72.345.678-9', cpf: '723.456.789-00', isValidated: true },
  { id: 'player_68', name: 'Conceição Ferraz', position: 'Zagueira', age: 24, rg: '72.345.679-0', cpf: '723.456.790-11', isValidated: true },
  { id: 'player_69', name: 'Aparecida Matos', position: 'Meio-campo', age: 22, rg: '72.345.680-1', cpf: '723.456.791-22', isValidated: true },
  { id: 'player_70', name: 'Terezinha Brito', position: 'Atacante', age: 26, rg: '72.345.681-2', cpf: '723.456.792-33', isValidated: true },
  { id: 'player_71', name: 'Antônia Veloso', position: 'Meio-campo', age: 25, rg: '72.345.682-3', cpf: '723.456.793-44', isValidated: true },
  { id: 'player_72', name: 'Raimunda Castro', position: 'Zagueira', age: 23, rg: '72.345.683-4', cpf: '723.456.794-55', isValidated: true },
  { id: 'player_73', name: 'Josefa Bandeira', position: 'Atacante', age: 21, rg: '72.345.684-5', cpf: '723.456.795-66', isValidated: true },
  { id: 'player_74', name: 'Iracema Prado', position: 'Lateral', age: 28, rg: '72.345.685-6', cpf: '723.456.796-77', isValidated: true },
  { id: 'player_75', name: 'Doraci Lima', position: 'Meio-campo', age: 24, rg: '72.345.686-7', cpf: '723.456.797-88', isValidated: true },
  { id: 'player_76', name: 'Zélia Moraes', position: 'Atacante', age: 22, rg: '72.345.687-8', cpf: '723.456.798-99', isValidated: true },
  { id: 'player_77', name: 'Odete Vaz', position: 'Lateral', age: 25, rg: '72.345.688-9', cpf: '723.456.799-00', isValidated: true },

  // Time Dragões Vermelhos
  { id: 'player_78', name: 'Marlene Cortês', position: 'Goleira', age: 27, rg: '82.345.678-9', cpf: '823.456.789-00', isValidated: true },
  { id: 'player_79', name: 'Ivone Soares', position: 'Zagueira', age: 23, rg: '82.345.679-0', cpf: '823.456.790-11', isValidated: true },
  { id: 'player_80', name: 'Nilza Franco', position: 'Meio-campo', age: 24, rg: '82.345.680-1', cpf: '823.456.791-22', isValidated: true },
  { id: 'player_81', name: 'Dalva Cardoso', position: 'Atacante', age: 26, rg: '82.345.681-2', cpf: '823.456.792-33', isValidated: true },
  { id: 'player_82', name: 'Creusa Figueiredo', position: 'Meio-campo', age: 21, rg: '82.345.682-3', cpf: '823.456.793-44', isValidated: true },
  { id: 'player_83', name: 'Dirce Lacerda', position: 'Zagueira', age: 25, rg: '82.345.683-4', cpf: '823.456.794-55', isValidated: true },
  { id: 'player_84', name: 'Norma Pacheco', position: 'Atacante', age: 22, rg: '82.345.684-5', cpf: '823.456.795-66', isValidated: true },
  { id: 'player_85', name: 'Cleide Marques', position: 'Lateral', age: 24, rg: '82.345.685-6', cpf: '823.456.796-77', isValidated: true },
  { id: 'player_86', name: 'Sueli Caldeira', position: 'Meio-campo', age: 25, rg: '82.345.686-7', cpf: '823.456.797-88', isValidated: true },
  { id: 'player_87', name: 'Divina Sena', position: 'Atacante', age: 23, rg: '82.345.687-8', cpf: '823.456.798-99', isValidated: true },
  { id: 'player_88', name: 'Bernadete Quintana', position: 'Lateral', age: 28, rg: '82.345.688-9', cpf: '823.456.799-00', isValidated: true },
]

// Times de exemplo
export const sampleTeams: Team[] = [
  {
    id: 'team_1',
    name: 'Estrelas do Futebol',
    email: 'estrelas@email.com',
    password: 'senha123',
    phone: '(11) 99999-1111',
    captain: 'Maria Silva',
    captainPhone: '(11) 99999-1112',
    city: 'São Paulo',
    state: 'SP',
    foundationYear: 2018,
    colors: 'Azul e Branco',
    description: 'Time fundado em 2018 com foco no desenvolvimento do futebol feminino em São Paulo.',
    players: samplePlayers.slice(0, 11),
    createdAt: '2024-01-15T10:00:00.000Z',
    role: 'user',
    enrolledTournaments: ['tournament_1', 'tournament_2']
  },
  {
    id: 'team_2',
    name: 'Força Feminina',
    email: 'forca@email.com',
    password: 'senha123',
    phone: '(21) 99999-2222',
    captain: 'Isabela Barbosa',
    captainPhone: '(21) 99999-2223',
    city: 'Rio de Janeiro',
    state: 'RJ',
    foundationYear: 2019,
    colors: 'Vermelho e Preto',
    description: 'Equipe carioca dedicada à formação de atletas e promoção do esporte feminino.',
    players: samplePlayers.slice(11, 22),
    createdAt: '2024-01-20T14:30:00.000Z',
    role: 'user',
    enrolledTournaments: ['tournament_1']
  },
  {
    id: 'team_3',
    name: 'Guerreiras FC',
    email: 'guerreiras@email.com',
    password: 'senha123',
    phone: '(31) 99999-3333',
    captain: 'Bruna Araújo',
    captainPhone: '(31) 99999-3334',
    city: 'Belo Horizonte',
    state: 'MG',
    foundationYear: 2017,
    colors: 'Verde e Amarelo',
    description: 'Time mineiro com tradição no futebol feminino regional.',
    players: samplePlayers.slice(22, 33),
    createdAt: '2024-02-01T09:15:00.000Z',
    role: 'user',
    enrolledTournaments: ['tournament_2']
  },
  {
    id: 'team_4',
    name: 'Amazonas United',
    email: 'amazonas@email.com',
    password: 'senha123',
    phone: '(92) 99999-4444',
    captain: 'Tatiana Machado',
    captainPhone: '(92) 99999-4445',
    city: 'Manaus',
    state: 'AM',
    foundationYear: 2020,
    colors: 'Verde e Branco',
    description: 'Representando a força do futebol feminino amazônico.',
    players: samplePlayers.slice(33, 44),
    createdAt: '2024-02-10T16:45:00.000Z',
    role: 'user',
    enrolledTournaments: ['tournament_1', 'tournament_3']
  },
  {
    id: 'team_5',
    name: 'Panteras do Sul',
    email: 'panteras@email.com',
    password: 'senha123',
    phone: '(51) 99999-5555',
    captain: 'Michele Brandão',
    captainPhone: '(51) 99999-5556',
    city: 'Porto Alegre',
    state: 'RS',
    foundationYear: 2016,
    colors: 'Preto e Rosa',
    description: 'Time gaúcho conhecido pela garra e determinação em campo.',
    players: samplePlayers.slice(44, 55),
    createdAt: '2024-02-15T11:20:00.000Z',
    role: 'user',
    enrolledTournaments: ['tournament_2', 'tournament_3']
  },
  {
    id: 'team_6',
    name: 'Águias Douradas',
    email: 'aguias@email.com',
    password: 'senha123',
    phone: '(85) 99999-6666',
    captain: 'Luciene Tavares',
    captainPhone: '(85) 99999-6667',
    city: 'Fortaleza',
    state: 'CE',
    foundationYear: 2021,
    colors: 'Dourado e Azul',
    description: 'Jovem equipe nordestina em ascensão no cenário nacional.',
    players: samplePlayers.slice(55, 66),
    createdAt: '2024-03-01T08:00:00.000Z',
    role: 'user',
    enrolledTournaments: ['tournament_3']
  },
  {
    id: 'team_7',
    name: 'Tigres do Norte',
    email: 'tigres@email.com',
    password: 'senha123',
    phone: '(84) 99999-7777',
    captain: 'Francisca Medeiros',
    captainPhone: '(84) 99999-7778',
    city: 'Natal',
    state: 'RN',
    foundationYear: 2019,
    colors: 'Laranja e Preto',
    description: 'Equipe potiguar com foco na revelação de novos talentos.',
    players: samplePlayers.slice(66, 77),
    createdAt: '2024-03-05T13:30:00.000Z',
    role: 'user',
    enrolledTournaments: ['tournament_1']
  },
  {
    id: 'team_8',
    name: 'Dragões Vermelhos',
    email: 'dragoes@email.com',
    password: 'senha123',
    phone: '(62) 99999-8888',
    captain: 'Marlene Cortês',
    captainPhone: '(62) 99999-8889',
    city: 'Goiânia',
    state: 'GO',
    foundationYear: 2018,
    colors: 'Vermelho e Dourado',
    description: 'Time goiano com história consolidada no futebol feminino do Centro-Oeste.',
    players: samplePlayers.slice(77, 88),
    createdAt: '2024-03-10T15:45:00.000Z',
    role: 'user',
    enrolledTournaments: ['tournament_2']
  }
]

// Torneios de exemplo
export const sampleTournaments: Tournament[] = [
  {
    id: 'tournament_1',
    title: 'Copa PAB 2025 - Primeira Divisão',
    description: 'Torneio principal da Copa PAB 2025, reunindo as melhores equipes do país para uma competição emocionante de futebol feminino.',
    date: '2025-03-15',
    registrationDeadline: '2025-03-01',
    location: 'Complexo Esportivo PAB - São Paulo, SP',
    maxTeams: 16,
    registeredTeams: 8,
    prize: 'R$ 50.000 + Troféu + Medalhas',
    imageUrl: '/images/tournament-1.jpg',
    isRegistrationOpen: true,
    status: 'published',
    isPublic: true,
    createdAt: '2024-12-01T10:00:00.000Z',
    createdBy: 'admin_copa_pab'
  },
  {
    id: 'tournament_2',
    title: 'Torneio Regional Sudeste',
    description: 'Competição regional focada no desenvolvimento de times do sudeste brasileiro, promovendo o intercâmbio esportivo.',
    date: '2025-04-20',
    registrationDeadline: '2025-04-05',
    location: 'Centro de Treinamento Futebol Feminino - Rio de Janeiro, RJ',
    maxTeams: 12,
    registeredTeams: 6,
    prize: 'R$ 25.000 + Troféu + Medalhas',
    imageUrl: '/images/tournament-2.jpg',
    isRegistrationOpen: true,
    status: 'published',
    isPublic: true,
    createdAt: '2024-12-05T14:30:00.000Z',
    createdBy: 'admin_copa_pab'
  },
  {
    id: 'tournament_3',
    title: 'Copa Jovens Talentos',
    description: 'Torneio dedicado ao desenvolvimento de jovens atletas, com foco na formação e descoberta de novos talentos.',
    date: '2025-05-10',
    registrationDeadline: '2025-04-25',
    location: 'Estádio Municipal de Esportes - Belo Horizonte, MG',
    maxTeams: 8,
    registeredTeams: 4,
    prize: 'R$ 15.000 + Troféu + Medalhas + Bolsas de Estudo',
    imageUrl: '/images/tournament-3.jpg',
    isRegistrationOpen: true,
    status: 'published',
    isPublic: true,
    createdAt: '2024-12-10T09:15:00.000Z',
    createdBy: 'admin_copa_pab'
  },
  {
    id: 'tournament_4',
    title: 'Torneio de Verão Copa PAB',
    description: 'Competição de verão com formato mais descontraído, promovendo a integração entre as equipes participantes.',
    date: '2025-01-25',
    registrationDeadline: '2025-01-15',
    location: 'Praia do Futsal - Florianópolis, SC',
    maxTeams: 16,
    registeredTeams: 0,
    prize: 'R$ 20.000 + Troféu + Medalhas',
    imageUrl: '/images/tournament-4.jpg',
    isRegistrationOpen: false,
    status: 'completed',
    isPublic: true,
    createdAt: '2024-11-15T16:45:00.000Z',
    createdBy: 'admin_copa_pab',
    winner: 'Estrelas do Futebol'
  },
  {
    id: 'tournament_5',
    title: 'Copa PAB Master',
    description: 'Torneio para equipes veteranas, celebrando a experiência e a paixão pelo futebol feminino.',
    date: '2025-06-15',
    registrationDeadline: '2025-06-01',
    location: 'Arena Esportiva - Brasília, DF',
    maxTeams: 10,
    registeredTeams: 0,
    prize: 'R$ 30.000 + Troféu + Medalhas',
    imageUrl: '/images/tournament-5.jpg',
    isRegistrationOpen: false,
    status: 'draft',
    isPublic: false,
    createdAt: '2024-12-15T11:20:00.000Z',
    createdBy: 'admin_copa_pab'
  }
]

// Função para popular o localStorage
export const populateLocalStorage = () => {
  // Verificar se já existem dados para não sobrescrever
  const existingUsers = localStorage.getItem('users')
  const existingTournaments = localStorage.getItem('tournaments')
  
  if (!existingUsers || JSON.parse(existingUsers).length === 0) {
    localStorage.setItem('users', JSON.stringify(sampleTeams))
    console.log('✅ Times de exemplo adicionados ao localStorage')
  } else {
    console.log('ℹ️ Times já existem no localStorage')
  }
  
  if (!existingTournaments || JSON.parse(existingTournaments).length === 0) {
    localStorage.setItem('tournaments', JSON.stringify(sampleTournaments))
    console.log('✅ Torneios de exemplo adicionados ao localStorage')
  } else {
    console.log('ℹ️ Torneios já existem no localStorage')
  }
  
  // Adicionar estatísticas gerais para o dashboard
  const dashboardStats = {
    totalTeams: sampleTeams.length,
    totalPlayers: samplePlayers.length,
    totalTournaments: sampleTournaments.length,
    activeTournaments: sampleTournaments.filter(t => t.status === 'published').length,
    completedTournaments: sampleTournaments.filter(t => t.status === 'completed').length,
    lastUpdated: new Date().toISOString()
  }
  
  localStorage.setItem('dashboardStats', JSON.stringify(dashboardStats))
  console.log('✅ Estatísticas do dashboard atualizadas')
}

// Função para limpar todos os dados (útil para testes)
export const clearAllData = () => {
  localStorage.removeItem('users')
  localStorage.removeItem('tournaments')
  localStorage.removeItem('dashboardStats')
  localStorage.removeItem('currentUser')
  console.log('🗑️ Todos os dados foram removidos do localStorage')
}

// Função para adicionar mais dados se necessário
export const addMoreSampleData = () => {
  const currentUsers = JSON.parse(localStorage.getItem('users') || '[]')
  const currentTournaments = JSON.parse(localStorage.getItem('tournaments') || '[]')
  
  // Adicionar mais times se necessário
  if (currentUsers.length < 8) {
    const missingTeams = sampleTeams.slice(currentUsers.length)
    const updatedUsers = [...currentUsers, ...missingTeams]
    localStorage.setItem('users', JSON.stringify(updatedUsers))
    console.log(`✅ Adicionados ${missingTeams.length} times adicionais`)
  }
  
  // Adicionar mais torneios se necessário
  if (currentTournaments.length < 5) {
    const missingTournaments = sampleTournaments.slice(currentTournaments.length)
    const updatedTournaments = [...currentTournaments, ...missingTournaments]
    localStorage.setItem('tournaments', JSON.stringify(updatedTournaments))
    console.log(`✅ Adicionados ${missingTournaments.length} torneios adicionais`)
  }
}