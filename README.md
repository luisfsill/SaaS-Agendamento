# Ritmo Agendamento SaaS

> Sistema de agendamento online multi-tenant com painel administrativo, integração WhatsApp e arquitetura moderna.

## ⚠️ AVISO: Repositório Privado

Este projeto é um SaaS privado e **NÃO deve ser compartilhado publicamente**. O acesso ao código é restrito a desenvolvedores autorizados pela equipe do Ritmo Agendamento.

Se você recebeu acesso:
- **Não divulgue, compartilhe ou torne público este repositório.**
- Siga as políticas de segurança e privacidade da empresa.
- Dúvidas sobre permissões, onboarding ou uso do código? Fale com o responsável técnico do projeto.

---

## 📋 Estrutura do Projeto

```
SaaS-Agendamento/
├── frontend/          # App Next.js 14 (cliente/dashboard)
└── openapi.json       # Especificação da API
```

## 🚀 Início Rápido

### Frontend (Next.js)

```sh
cd frontend
npm install
npm run dev
```

Acesse: [http://localhost:3000](http://localhost:3000)

### Configurar Ambiente

Crie um arquivo `.env.local` na pasta `frontend/`:

```env
NEXT_PUBLIC_RITMO_API_URL=http://localhost:8000
NEXT_PUBLIC_UAZAPI_URL=https://lfsystem.uazapi.com
UAZAPI_ADMIN_TOKEN=SEU_TOKEN_AQUI
NEXT_PUBLIC_UAZAPI_WEBHOOK_URL=https://seu-webhook.com
```

## 🎯 Funcionalidades Principais

✅ Painel do cliente (dashboard)  
✅ Painel administrativo (admin)  
✅ Integração WhatsApp (UAZAPI)  
✅ Sistema multi-tenant  
✅ Responsivo (mobile, tablet, desktop)  
✅ Tema claro/escuro  
✅ Autenticação JWT  

## 🛠️ Stack Técnico

- **Frontend:** Next.js 14, TypeScript, CSS Modules
- **Auth:** JWT
- **Integração:** UAZAPI (WhatsApp)
- **UI:** Componentes custom + Lucide Icons

## 📚 Documentação

- [Frontend README](./frontend/README.md) - Detalhes da aplicação Next.js
- [API Spec](./openapi.json) - Especificação OpenAPI

## 📝 Scripts Principais

```sh
# Frontend
cd frontend
npm run dev      # Desenvolvimento
npm run build    # Build de produção
npm run start    # Produção
```

## 🔐 Segurança

- Não commite `.env.local` com credenciais reais
- Use variáveis de ambiente para dados sensíveis
- Tokens UAZAPI devem ser mantidos privados

## 💬 Suporte

Para dúvidas técnicas ou problemas, entre em contato com o responsável pelo projeto.

---

**Desenvolvido com ❤️ para Ritmo Agendamento**
