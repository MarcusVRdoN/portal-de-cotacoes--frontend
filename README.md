# Portal de Cotações - Frontend

## 🚀 Instalação e Configuração

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn

### 1. Instalação das Dependências

```bash
npm install
# ou
yarn install
```

### 2. Estrutura de Pastas

```
portal-cotacoes-frontend/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   └── favicon.ico
├── components/
│   ├── ui/
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── textarea.tsx
│   │   ├── tabs.tsx
│   │   ├── badge.tsx
│   │   ├── avatar.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── dialog.tsx
│   │   ├── select.tsx
│   │   └── ...
│   └── PortalCotacoes.tsx
├── lib/
│   └── utils.ts
├── next.config.js
├── package.json
├── postcss.config.js
├── README.md
├── tailwind.config.js
└── tsconfig.json
```

### 3. Executar o Projeto

```bash
npm run dev
# ou
yarn dev
```

### 4. Usuários de Teste

| Email | Senha | Tipo | Acesso |
|-------|-------|------|---------|
| `admin@portal.com` | `123456` | ADMIN | Completo |
| `joao.cliente@email.com` | `123456` | CLIENT | Cotações e Pedidos |
| `maria.fornecedora@email.com` | `123456` | SUPPLIER | Responder Cotações |

## 🎯 Funcionalidades Implementadas

### ✅ Autenticação
- [x] Login com email/senha
- [x] Controle de sessão
- [x] Perfis diferenciados (Admin, Cliente, Fornecedor)
- [x] Logout

### ✅ Dashboard
- [x] Visão geral do sistema
- [x] Estatísticas principais
- [x] Cotações recentes
- [x] Produtos em destaque

### ✅ Gestão de Cotações
- [x] Solicitar nova cotação (Cliente)
- [x] Listar cotações
- [x] Visualizar detalhes
- [x] Controle de status
- [x] Filtros por usuário

### ✅ Gestão de Pedidos  
- [x] Criar novo pedido (Cliente)
- [x] Listar pedidos
- [x] Visualizar detalhes
- [x] Controle de status
- [x] Cálculo de valores

### ✅ Gestão de Produtos (Admin)
- [x] Cadastrar produtos
- [x] Listar produtos
- [x] Controle de estoque
- [x] Edição/exclusão
- [x] Alertas de estoque baixo

### ✅ Gestão de Usuários (Admin)
- [x] Cadastrar usuários
- [x] Listar usuários
- [x] Definir tipos de usuário
- [x] Edição/exclusão

### ✅ Interface
- [x] Design responsivo
- [x] Sidebar com navegação
- [x] Header com perfil do usuário
- [x] Modais para criação/edição
- [x] Badges de status
- [x] Componentes shadcn/ui

## 🛠️ Tecnologias Utilizadas

- **Next.js 14** - Framework React com App Directory
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização utilitária
- **shadcn/ui** - Biblioteca de componentes
- **Lucide React** - Ícones
- **Radix UI** - Componentes primitivos

## 📱 Responsividade

A aplicação é totalmente responsiva e funciona bem em:
- Desktop (1920px+)
- Tablet (768px - 1024px)
- Mobile (320px - 768px)

## 🔧 Customização

### Cores e Temas
Edite `app/globals.css` para personalizar:
- Cores primárias e secundárias
- Modo escuro/claro
- Espaçamentos

### Componentes
Adicione novos componentes em `components/ui/` seguindo o padrão shadcn/ui.

### Rotas
Adicione novas páginas em `app/` seguindo a estrutura App Directory do Next.js 13+.

## 🚀 Deploy

### Vercel (Recomendado)
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm run build
# Upload da pasta .next para Netlify
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 📋 Próximos Passos

1. **Integração com Backend**
   - Conectar com API do backend Node.js
   - Implementar autenticação JWT real
   - Gerenciamento de estado com Context API ou Zustand

2. **Funcionalidades Avançadas**
   - Sistema de notificações
   - Upload de arquivos
   - Relatórios em PDF
   - Filtros avançados

3. **Melhorias de UX**
   - Loading states
   - Error boundaries
   - Skeleton loaders
   - Toasts de feedback

4. **Testes**
   - Jest + Testing Library
   - Cypress para E2E
   - Storybook para componentes

## 🐛 Troubleshooting

### Erro de Build
```bash
# Limpar cache
rm -rf .next
npm run dev
```

### Problemas de CSS
```bash
# Reinstalar Tailwind
npm uninstall tailwindcss
npm install tailwindcss@latest
```

### TypeScript Errors
```bash
# Verificar tipos
npx tsc --noEmit
```

## 📞 Suporte

- GitHub Issues
- Email: suporte@portalcotacoes.com
- Documentação: [docs.portalcotacoes.com]

---

**Portal de Cotações** - Sistema completo de gestão empresarial 🏢