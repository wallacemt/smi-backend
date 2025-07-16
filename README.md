# 🚀 Backend - Sistema Inteligente de Marketing (SMI)

Backend da aplicação **Sistema Inteligente de Marketing** desenvolvido em Node.js com TypeScript, Express e Prisma. Este sistema oferece funcionalidades de autenticação, gerenciamento de empresas, geração de conteúdo com IA e integração com serviços externos.

## 📋 Índice

- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Funcionalidades](#funcionalidades)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Como Executar](#como-executar)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [API Documentation](#api-documentation)
- [Testes](#testes)
- [Deploy](#deploy)
- [Contribuição](#contribuição)

## 🛠️ Tecnologias Utilizadas

- **Node.js** (v22+)
- **TypeScript**
- **Express.js** - Framework web
- **Prisma** - ORM para PostgreSQL
- **PostgreSQL** - Banco de dados
- **JWT** - Autenticação
- **Argon2** - Hash de senhas
- **Google Gemini AI** - Geração de conteúdo
- **Cloudinary** - Upload de imagens
- **Swagger** - Documentação da API
- **Jest** - Testes
- **Docker** - Containerização

## ✨ Funcionalidades

- 🔐 **Autenticação JWT** com controle de tentativas de login
- 🏢 **Gerenciamento de Empresas** e dados corporativos
- 👥 **Sistema de Personas** para marketing
- 🤖 **Geração de Conteúdo com IA** (texto e imagens)
- 📝 **Geração de Posts** baseados em personas
- 🌐 **Web Scraping** de conteúdo
- 📊 **Status de Serviços** em tempo real
- 📚 **Documentação Automática** da API

## 📋 Pré-requisitos

- Node.js (versão 22 ou superior)
- PostgreSQL (versão 12 ou superior)
- npm ou yarn
- Docker e Docker Compose (opcional)

## 🚀 Instalação

1. **Clone o repositório**

   ```bash
   git clone <url-do-repositorio>
   cd backend
   ```

2. **Instale as dependências**

   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente**
   ```bash
   cp .env.example .env
   ```

## ⚙️ Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# Configurações do Servidor
NODE_ENV=dev
PORT=3000
FRONTEND_URL=http://localhost:3000

# Banco de Dados
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/bootcamp"

# Autenticação
JWT_SECRET=sua_chave_secreta_jwt_aqui

# Google Gemini AI
GEMINI_API_KEY=sua_chave_api_gemini_aqui

# Cloudinary
CLOUDINARY_CLOUD_NAME=seu_cloud_name
CLOUDINARY_API_KEY=sua_api_key_cloudinary
CLOUDINARY_API_SECRET=sua_api_secret_cloudinary

# App ID (identificador da aplicação)
APP_ID=seu_app_id_aqui
```

### Como Obter as API Keys

#### 🔑 Google Gemini API Key

1. Acesse [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Faça login com sua conta Google
3. Clique em "Create API Key"
4. Copie a chave gerada e adicione ao `.env`

#### ☁️ Cloudinary

1. Acesse [Cloudinary Console](https://cloudinary.com/console)
2. Crie uma conta gratuita ou faça login
3. No Dashboard, você encontrará:
   - **Cloud Name**: Nome da sua nuvem
   - **API Key**: Chave da API
   - **API Secret**: Segredo da API
4. Adicione essas informações ao `.env`

#### 🔐 JWT Secret

Gere uma chave secreta forte para JWT:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## 🏃‍♂️ Como Executar

### Desenvolvimento Local

1. **Configure o banco de dados**

   ```bash
   # Gere o cliente Prisma
   npm run db:generate

   # Execute as migrações
   npm run db:migrate
   ```

2. **Inicie o servidor de desenvolvimento**

   ```bash
   npm run dev
   ```

3. **Acesse a documentação da API**
   ```
   http://localhost:3000/docs
   ```

### Com Docker

1. **Suba os containers**

   ```bash
   npm run prod:up
   ```

2. **Para parar os containers**
   ```bash
   npm run prod:down
   ```

### Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Inicia o servidor com nodemon
npm run build            # Compila o TypeScript
npm run start            # Inicia o servidor em produção

# Banco de dados
npm run db:generate      # Gera o cliente Prisma
npm run db:migrate       # Executa as migrações
npm run db:studio        # Abre o Prisma Studio

# Testes
npm run test             # Executa os testes
npm run test:watch       # Executa os testes em modo watch

# Docker
npm run prod:up          # Sobe os containers
npm run prod:down        # Para os containers
```

## 📁 Estrutura do Projeto

```
backend/
├── src/
│   ├── controllers/     # Controladores das rotas
│   ├── services/        # Lógica de negócio
│   ├── repository/      # Camada de acesso a dados
│   ├── middleware/      # Middlewares (auth, logs)
│   ├── types/          # Tipos TypeScript
│   ├── utils/          # Utilitários
│   ├── validations/    # Validações com Zod
│   ├── docs/           # Documentação Swagger
│   └── tests/          # Testes
├── prisma/
│   ├── schema.prisma   # Schema do banco de dados
│   └── migrations/     # Migrações do banco
├── docker-compose.yaml # Configuração Docker
├── Dockerfile         # Imagem Docker
└── package.json       # Dependências e scripts
```

## 📚 API Documentation

A documentação completa da API está disponível através do Swagger UI:

- **URL**: `http://localhost:3000/docs`
- **Redirecionamento**: A rota raiz (`/`) redireciona automaticamente para `/docs`

### Principais Endpoints

- **Status**: `/status` - Verificar saúde dos serviços
- **Auth**: `/auth` - Autenticação e registro
- **Company**: `/company` - Gerenciamento de empresas
- **AI**: `/ai` - Geração de conteúdo com IA

## 🧪 Testes

### Executar Testes

```bash
# Todos os testes
npm run test

# Testes em modo watch
npm run test:watch
```

### Configuração de Testes

- Os testes usam Jest como framework
- Banco de dados de teste separado
- Mocks para serviços externos

## 🚀 Deploy

### Deploy com Docker

1. **Build da imagem**

   ```bash
   docker build -t smi-backend .
   ```

2. **Executar container**
   ```bash
   docker run -p 8081:8081 --env-file .env smi-backend
   ```

### Deploy Manual

1. **Build do projeto**

   ```bash
   npm run build
   ```

2. **Configurar variáveis de produção**

   ```bash
   NODE_ENV=production
   ```

3. **Executar migrações**

   ```bash
   npm run db:migrate
   ```

4. **Iniciar aplicação**
   ```bash
   npm start
   ```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença ISC. Veja o arquivo `LICENSE` para mais detalhes.

## 🆘 Suporte

Para suporte, entre em contato através de:

- Issues do GitHub
---

