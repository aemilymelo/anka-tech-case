# 📘 Sistema de Gerenciamento de Clientes e Ativos Financeiros

Este projeto consiste em uma aplicação full stack desenvolvida com **Next.js (frontend)** e **Fastify (backend)**, utilizando **Prisma ORM** para acesso ao banco de dados **MySQL**. A solução permite o **gerenciamento de clientes e seus respectivos ativos financeiros**, com operações de cadastro, listagem, edição e exclusão. O projeto foi desenvolvido integralmente com **TypeScript** e conta com validações robustas de dados.

---

## 📚 Funcionalidades Implementadas

1. **Gestão de Clientes**

   * Cadastro, edição e exclusão de clientes
   * Campos: nome, e-mail e status (ativo/inativo)

2. **Gestão de Ativos**

   * Cadastro, listagem, edição e exclusão de ativos financeiros vinculados a um cliente
   * Campos: nome do ativo e valor atual

3. **Visualização por Cliente**

   * Página para visualizar todos os ativos financeiros alocados a um cliente específico

4. **Listagem Global de Ativos**

   * Endpoint para retorno de ativos de forma geral

5. **Validação e Boas Práticas**

   * Validação de formulários com **React Hook Form** e **Zod**
   * Interface moderna com **ShadCN UI** + **Tailwind CSS**
   * Organização em componentes reutilizáveis

---

## 🧰 Tecnologias e Ferramentas

### Frontend

* **Next.js** com TypeScript
* **Tailwind CSS** para estilização
* **ShadCN UI** para componentes visuais
* **React Query** (TanStack) para gerenciamento de dados
* **React Hook Form** + **Zod** para formulários e validações
* **Axios** para consumo de APIs REST

### Backend

* **Node.js** com **Fastify**
* **Prisma ORM** com **MySQL**
* **Zod** para validação de dados no backend
* **Docker Compose** para orquestração de containers

---

## 🧪 Como Executar o Projeto

### Pré-requisitos

* Docker + Docker Compose
* Node.js 18+
* npm ou yarn

### 1. Clonar o repositório

```bash
git clone https://github.com/aemilymelo/anka-tech-case.git
cd anka-tech-case
```

### 2. Inicializar o banco de dados (MySQL via Docker)

```bash
cd backend
docker-compose up -d
```

### 3. Rodar as migrations e iniciar o backend

```bash
npm install
npx prisma migrate dev
npm run dev
```

### 4. Iniciar o frontend

```bash
cd ../frontend
npm install
npm run dev
```

---

## 🌐 Estrutura das Pastas

```
anka-tech-case/
├── backend/                   # Backend com Fastify + Prisma
│   ├── prisma/               # Schema do banco e migrations
│   ├── src/                  # Código-fonte (rotas e servidor)
│   ├── .env                  # Variáveis de ambiente do backend
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                 # Aplicação frontend em Next.js + ShadCN + Tailwind
│   ├── public/               # Arquivos públicos (favicon, etc.)
│   ├── src/
│   │   ├── components/ui/    # Componentes reutilizáveis (ShadCN)
│   │   ├── lib/              # Funções utilitárias (se houver)
│   │   ├── pages/            # Páginas da aplicação
│   │   └── styles/           # Arquivo globals.css com Tailwind
│   ├── tailwind.config.js    # Configuração do Tailwind
│   ├── postcss.config.js     # Configuração do PostCSS
│   ├── next.config.ts        # Configuração do Next.js
│   ├── tsconfig.json
│   └── package.json
│
├── docker-compose.yml        # Orquestra backend e banco MySQL
├── README.md                 # Documentação do projeto
└── .gitignore
```

---

## 📂 Organização das Rotas

### Backend - Fastify (HTTP)

* `GET /clientes` – Listar clientes
* `POST /clientes` – Criar cliente
* `PUT /clientes/:id` – Editar cliente
* `DELETE /clientes/:id` – Excluir cliente
* `GET /ativos` – Listar ativos globais
* `GET /clientes/:id/ativos` – Listar ativos de um cliente
* `POST /clientes/:id/ativos` – Cadastrar ativo para cliente
* `PUT /ativos/:id` – Editar ativo
* `DELETE /ativos/:id` – Excluir ativo

---

## 👩‍💻 Autora

**Emily Melo**
Estudante de Ciência da Computação







