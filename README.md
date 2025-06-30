# Portal de Cotações - Frontend

Um sistema web completo para gestão de cotações de produtos médicos e hospitalares, desenvolvido como projeto tecnológico do curso de Análise e Desenvolvimento de Sistemas da ULBRA.

## 📋 Sobre o Projeto

O Portal de Cotações é uma aplicação web que facilita o processo de solicitação e resposta de cotações entre clientes e fornecedores de produtos médicos e hospitalares. O sistema oferece diferentes níveis de acesso (Admin, Cliente, Fornecedor) e inclui funcionalidades completas de gestão de produtos, usuários, cotações e pedidos.

### 🎯 Objetivos
- Automatizar o processo de cotações
- Centralizar a comunicação entre clientes e fornecedores
- Facilitar o controle de estoque e pedidos
- Proporcionar uma interface intuitiva e responsiva

## 🚀 Instalação e Configuração

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn
- Git

### 1. Clone o Repositório

```bash
git clone https://github.com/MarcusVRdoN/portal-de-cotacoes--frontend.git
cd portal-cotacoes-frontend
```

### 2. Instalação das Dependências

```bash
npm install
```

### 3. Configuração do Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### 4. Executar o Projeto

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Iniciar em produção
npm start
```

A aplicação estará disponível em `http://localhost:3000`

## 📁 Estrutura do Projeto

```
portal-cotacoes-frontend/
├── app/                          # App Router do Next.js 14
│   ├── globals.css              # Estilos globais
│   ├── layout.tsx               # Layout principal
│   ├── page.tsx                 # Página inicial
│   └── favicon.ico              # Ícone da aplicação
├── components/                   # Componentes React
│   ├── ui/                      # Componentes base (shadcn/ui)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── dialog.tsx
│   │   ├── select.tsx
│   │   └── ...
│   ├── Dashboard.tsx            # Dashboard principal
│   ├── Header.tsx               # Cabeçalho da aplicação
│   ├── LoginForm.tsx            # Formulário de login
│   ├── OrdersManager.tsx        # Gestão de pedidos
│   ├── PortalCotacoes.tsx       # Componente principal
│   ├── ProductsManager.tsx      # Gestão de produtos
│   ├── QuotesManager.tsx        # Gestão de cotações
│   ├── Sidebar.tsx              # Menu lateral
│   └── UsersManager.tsx         # Gestão de usuários
├── hooks/                       # Hooks personalizados
│   └── useApi.ts               # Hook para API
├── lib/                         # Utilitários
│   └── utils.ts                # Funções auxiliares
├── services/                    # Serviços de API
│   ├── api.ts                  # Configuração do Axios
│   └── index.ts                # Exportações
├── @types/                      # Definições de tipos TypeScript
│   ├── api.ts
│   ├── components.ts
│   └── index.ts
├── next.config.js              # Configuração do Next.js
├── package.json                # Dependências e scripts
├── tailwind.config.js          # Configuração do Tailwind
└── tsconfig.json               # Configuração do TypeScript
```

## 👥 Usuários de Teste

| Email | Senha | Tipo | Permissões |
|-------|-------|------|------------|
| `admin@portal.com` | `123456` | **ADMIN** | Acesso completo ao sistema |
| `marcus.nascimento@rede.ulbra.br` | `123456` | **CLIENT** | Cotações e Pedidos |
| `maria.fornecedora@email.com` | `123456` | **SUPPLIER** | Responder Cotações |

## 🎯 Funcionalidades Implementadas

### ✅ Sistema de Autenticação
- [x] Login com email/senha
- [x] Controle de sessão
- [x] Perfis diferenciados (Admin, Cliente, Fornecedor)
- [x] Logout seguro
- [x] Proteção de rotas por tipo de usuário

### ✅ Dashboard Interativo
- [x] Visão geral do sistema
- [x] Estatísticas principais (Admin)
- [x] Cards informativos por perfil
- [x] Navegação intuitiva

### ✅ Gestão de Cotações
- [x] Solicitar nova cotação (Cliente)
- [x] Listar todas as cotações
- [x] Visualizar detalhes completos
- [x] Responder cotações (Fornecedor)
- [x] Filtros por usuário e status
- [x] Histórico de interações

### ✅ Gestão de Pedidos  
- [x] Criar novo pedido (Cliente)
- [x] Listar todos os pedidos
- [x] Visualizar detalhes e itens
- [x] Cálculo automático de valores
- [x] Controle de status
- [x] Histórico de pedidos

### ✅ Gestão de Produtos (Admin)
- [x] Cadastrar novos produtos
- [x] Listar produtos com paginação
- [x] Controle de estoque em tempo real
- [x] Edição e exclusão de produtos
- [x] Busca e filtros avançados

### ✅ Gestão de Usuários (Admin)
- [x] Cadastrar novos usuários
- [x] Listar usuários por tipo
- [x] Definir permissões específicas
- [x] Edição e exclusão de usuários
- [x] Controle de acesso granular

### ✅ Interface e UX
- [x] Design responsivo (mobile-first)
- [x] Sidebar com navegação contextual
- [x] Header com perfil do usuário
- [x] Modais para criação/edição
- [x] Badges de status visuais
- [x] Feedback visual para ações
- [x] Loading states
- [x] Tratamento de erros

## 🛠️ Tecnologias Utilizadas

### Frontend
- **Next.js 14** - Framework React com App Directory
- **TypeScript** - Tipagem estática para maior segurança
- **Tailwind CSS** - Framework CSS utilitário
- **shadcn/ui** - Biblioteca de componentes modernos
- **Radix UI** - Componentes primitivos acessíveis
- **Lucide React** - Biblioteca de ícones

### Dependências Principais
- **React 18** - Biblioteca para interfaces de usuário
- **Axios** - Cliente HTTP para APIs
- **class-variance-authority** - Gerenciamento de variantes CSS
- **clsx** - Utilitário para classes condicionais
- **tailwind-merge** - Merge inteligente de classes Tailwind

### Ferramentas de Desenvolvimento
- **ESLint** - Linter para código JavaScript/TypeScript
- **PostCSS** - Processador CSS
- **Autoprefixer** - Prefixos CSS automáticos

## 🏗️ Arquitetura do Sistema

### Casos de Uso Implementados
1. **Realizar Login** - Autenticação com credenciais
2. **Cadastrar Usuário** - Registro por administradores
3. **Solicitar Cotação** - Clientes solicitam orçamentos
4. **Responder Cotação** - Fornecedores enviam propostas
5. **Consultar Cotação** - Visualização de status e respostas
6. **Realizar Pedido** - Criação de pedidos baseados em cotações
7. **Gerenciar Estoque** - Controle de produtos e quantidades

### Entidades Principais
- **Usuário** - Dados de autenticação e perfil
- **Cotação** - Solicitações de orçamento
- **Produto** - Catálogo de itens médicos/hospitalares
- **Pedido** - Solicitações de compra
- **Fornecedor** - Dados de empresas fornecedoras
- **ItemPedido** - Itens específicos de cada pedido

## 📈 Próximos Passos

### 🔄 Melhorias Planejadas
- [ ] Sistema de notificações em tempo real
- [ ] Relatórios em PDF para cotações e pedidos
- [ ] Filtros avançados e busca global
- [ ] Alertas de estoque baixo
- [ ] Dashboard com gráficos e métricas
- [ ] Histórico completo de ações
- [ ] Exportação de dados (Excel/CSV)

### 🎨 Melhorias de UX/UI
- [ ] Skeleton loaders para carregamento
- [ ] Toasts de feedback para ações
- [ ] Animações e transições suaves
- [ ] Tema escuro/claro
- [ ] Responsividade para dispositivos móveis
- [ ] Modo offline básico
- [ ] PWA (Progressive Web App)

### 🧪 Testes e Qualidade
- [ ] Testes unitários com Jest
- [ ] Testes de integração com Testing Library
- [ ] Testes E2E com Cypress
- [ ] Storybook para componentes
- [ ] Cobertura de código
- [ ] CI/CD pipeline

## 🚀 Deploy e Produção

### Variáveis de Ambiente
```env
NEXT_PUBLIC_API_URL=https://2kb8y5mqe6.execute-api.us-east-1.amazonaws.com
```

## 🐛 Troubleshooting

### Problemas Comuns

#### Erro de Build
```bash
# Limpar cache do Next.js
rm -rf .next
npm run dev
```

#### Problemas com Dependências
```bash
# Limpar node_modules e reinstalar
rm -rf node_modules package-lock.json
npm install
```

## 📄 Licença

Este projeto foi desenvolvido como trabalho acadêmico para a Universidade Luterana do Brasil (ULBRA) - Curso Superior de Tecnologia em Análise e Desenvolvimento de Sistemas.

## 👨‍💻 Desenvolvedor

**Marcus Vinícius Ribeiro do Nascimento**
- Email: marcus.nascimento@rede.ulbra.br
- Universidade: ULBRA - Educação a Distância
- Curso: Tecnólogo em Análise e Desenvolvimento de Sistemas