# ⚽ Copa PAB Platform

Uma plataforma completa de gerenciamento de torneios de futebol feminino, desenvolvida para a Copa Passa a Bola (Copa PAB). O sistema permite o cadastro de times, gerenciamento de jogadoras, geração automática de chaveamentos e área administrativa completa.


## Integrantes do Grupo
- Gabriel Ciriaco RM: 564880
- Davi Munhoz RM: 566223
- Mariana França RM: 562353
- Vinicius Mafra RM: 565916
- Larissa Shiba: 560462

## 🎯 Sobre o Projeto

A Copa PAB Platform é um sistema web moderno que facilita a organização de torneios de futebol feminino. Com foco na experiência do usuário e funcionalidades administrativas robustas, a plataforma oferece:

- **Gestão de Times**: Cadastro e gerenciamento completo de equipes
- **Controle de Jogadoras**: Sistema de registro com validação de documentos via OCR
- **Chaveamentos Automáticos**: Geração inteligente de eliminatórias balanceadas
- **Área Administrativa**: Painel completo para controle de torneios e usuários
- **Interface Responsiva**: Design moderno adaptado para todos os dispositivos

## 🚀 Tecnologias Utilizadas

### Frontend
- **React 19.1.1** - Biblioteca principal para interface de usuário
- **TypeScript** - Tipagem estática para maior segurança no desenvolvimento
- **Vite 7.1.9** - Build tool moderno e rápido
- **React Router DOM 7.9.4** - Roteamento client-side
- **Tailwind CSS 4.1.14** - Framework CSS utilitário

### Funcionalidades Especiais
- **Tesseract.js** - OCR para validação de documentos (RG/CNH)
- **React Icons** - Biblioteca de ícones
- **Class Variance Authority (CVA)** - Gerenciamento de variantes de componentes
- **LocalStorage** - Persistência de dados no navegador

### Ferramentas de Desenvolvimento
- **ESLint** - Linting para qualidade de código
- **PostCSS** - Processamento de CSS
- **Autoprefixer** - Compatibilidade entre browsers

## 📋 Pré-requisitos

Antes de começar, você precisará ter instalado em sua máquina:

- **Node.js** (versão 18.0 ou superior)
- **npm** (geralmente vem com o Node.js)
- **Git** (para clonar o repositório)

### Verificando as instalações:

```bash
# Verificar Node.js
node --version

# Verificar npm
npm --version

# Verificar Git
git --version
```

## 🛠️ Instalação e Configuração

### 1. Clone o Repositório

```bash
git clone https://github.com/DaviMunhoz1005/copa-pab-platform.git
cd copa-pab-platform
```

### 2. Instale as Dependências

```bash
npm install
```

### 3. Instale Dependências Específicas (se necessário)

Se houver problemas com o OCR:

```bash
npm install tesseract.js
```

### 4. Execute o Projeto

```bash
npm run dev
```

O projeto estará disponível em: **http://localhost:5173/**

*(Se a porta 5173 estiver ocupada, o Vite automaticamente usará a próxima disponível, como 5174)*

## 🌐 Estrutura do Projeto

```
copa-pab-platform/
├── public/                      # Arquivos estáticos
├── src/
│   ├── assets/                  # Imagens e recursos
│   │   └── imgs/
│   │       └── homepage/
│   ├── components/              # Componentes reutilizáveis
│   │   ├── homepage/           # Componentes específicos da homepage
│   │   └── ui/                 # Componentes de interface
│   ├── contexts/               # Context API (AuthContext)
│   ├── lib/                    # Utilitários e configurações
│   ├── pages/                  # Páginas da aplicação
│   ├── routes/                 # Configuração de rotas
│   └── utils/                  # Funções utilitárias
├── components.json             # Configuração de componentes
├── eslint.config.js           # Configuração do ESLint
├── package.json               # Dependências e scripts
├── tailwind.config.js         # Configuração do Tailwind
├── tsconfig.json              # Configuração do TypeScript
└── vite.config.ts             # Configuração do Vite
```

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Inicia servidor de desenvolvimento

# Build
npm run build           # Gera build de produção
npm run preview         # Preview do build de produção

# Qualidade de Código
npm run lint            # Executa ESLint
```

## 🎮 Funcionalidades Principais

### 👤 Para Usuários (Times)
- **Cadastro de Times**: Registro completo com informações da equipe
- **Gestão de Jogadoras**: Adicionar/editar jogadoras com upload de fotos
- **Validação de Documentos**: OCR automático para RG e CNH
- **Visualização de Torneios**: Acompanhar torneios disponíveis
- **Chaveamentos Públicos**: Ver chaveamentos aprovados pelos administradores

### 🛡️ Para Administradores
- **Login Administrativo**: Acesso exclusivo com credenciais específicas
- **Dashboard Completo**: Visão geral da plataforma com estatísticas
- **Gestão de Usuários**: Visualizar, editar e gerenciar todos os times
- **Controle de Torneios**: Criar, editar e gerenciar torneios
- **Chaveamentos Automáticos**: Gerar chaveamentos balanceados
- **Controle de Visibilidade**: Definir quais chaveamentos são públicos

## 🔐 Acesso Administrativo

### Credenciais Padrão:
- **URL**: `/admin/login`
- **Usuário**: `admin_copa_pab`
- **Senha**: `Copa@PAB2025!`

*⚠️ Em produção, altere essas credenciais por questões de segurança*

## 🎨 Tema e Design

O projeto utiliza um tema personalizado baseado nas cores da Copa PAB:

- **Hot Pink (#FF2C75)**: Cor principal
- **Pink Light (#FFE0EC)**: Cor secundária
- **Gradientes**: Sistema de gradientes personalizados
- **Tipografia**: Fontes otimizadas para legibilidade

## 📱 Páginas e Rotas

### Públicas:
- `/` - Homepage
- `/login` - Login de times
- `/cadastrar` - Cadastro de times
- `/torneios` - Lista de torneios
- `/chaveamentos` - Chaveamentos públicos

### Protegidas (Usuários):
- `/dashboard` - Painel do usuário
- `/profile` - Perfil do time
- `/jogadoras` - Gerenciar jogadoras
- `/chaveamento` - Demo de chaveamento

### Administrativas:
- `/admin/login` - Login administrativo
- `/admin/dashboard` - Dashboard administrativo
- `/admin/users` - Gerenciar usuários
- `/admin/tournaments` - Gerenciar torneios
- `/admin/brackets` - Controlar chaveamentos

## 💾 Armazenamento de Dados

O projeto utiliza **LocalStorage** para persistência de dados:

- `users` - Dados dos times cadastrados
- `currentUser` - Usuário logado atualmente
- `tournaments` - Dados dos torneios criados

*Em produção, considere migrar para um banco de dados real*

## 🔍 Funcionalidades Especiais

### OCR para Documentos
O sistema utiliza **Tesseract.js** para:
- Validação automática de RG e CNH
- Extração de dados dos documentos
- Verificação de autenticidade

### Geração de Chaveamentos
Algoritmo inteligente que:
- Calcula automaticamente o número de rodadas necessárias
- Distribui times de forma balanceada
- Lida com números ímpares usando "byes"
- Permite adição/remoção de times

## 🐛 Solução de Problemas

### Projeto não inicia:
```bash
# Limpar cache do npm
npm cache clean --force

# Reinstalar dependências
rm -rf node_modules package-lock.json
npm install

# Tentar novamente
npm run dev
```

### Erro de dependências:
```bash
# Instalar dependências específicas
npm install tesseract.js react-icons
```

### Problemas de porta:
O Vite automaticamente encontra uma porta disponível. Verifique o terminal para a URL correta.

### Problemas de OCR:
- Verifique se o Tesseract.js está instalado
- Teste com imagens de boa qualidade
- Aguarde o carregamento inicial do OCR

## 🚀 Deploy

### Build de Produção:
```bash
npm run build
```

Os arquivos gerados estarão na pasta `dist/` e podem ser hospedados em qualquer servidor web estático.

### Opções de Hospedagem:
- **Vercel** (recomendado para React)
- **Netlify**
- **GitHub Pages**
- **AWS S3 + CloudFront**

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para dúvidas ou problemas:
- Abra uma **issue** no GitHub
- Entre em contato com a equipe da Copa PAB

## 🎯 Próximas Features

- [ ] Integração com banco de dados real
- [ ] Sistema de notificações
- [ ] Chat em tempo real
- [ ] Relatórios avançados
- [ ] App mobile
- [ ] Sistema de pagamentos
- [ ] Integração com redes sociais

---

**Copa PAB Platform** - Desenvolvido com ❤️ para o futebol feminino brasileiro.
