# INTEGRA 2026 — Site institucional de evento + painel administrativo

Projeto completo em **Next.js 14** com:
- Home institucional responsiva
- Agenda dinâmica com ordenação
- Cadastro de palestrantes
- Patrocinadores por categoria
- Área interativa (fotos, comentários e avaliações)
- Moderação no painel admin
- Controle da identidade do evento (nome, logo e banner)

## 1) Como rodar localmente

```bash
npm install
npm run dev
```

Acesse:
- Site público: `http://localhost:3000`
- Painel admin: `http://localhost:3000/admin/login`

## 2) Como acessar o painel administrativo

Credenciais padrão:
- Usuário: `admin`
- Senha: `admin123`

Você pode alterar via variáveis de ambiente em `.env.local`:

```env
ADMIN_USER=seu_usuario
ADMIN_PASSWORD=sua_senha_forte
AUTH_SECRET=uma_chave_secreta_aleatoria
```

## 3) Como alterar nome, logo e banner do evento

1. Entre no painel (`/admin/login`)
2. Vá na seção **Configurações do Evento**
3. Edite:
   - Nome do evento
   - Data e local
   - Texto institucional
   - Upload de logo
   - Upload de banner principal
4. Clique em **Salvar identidade visual**

As alterações aparecem automaticamente na Home.

## 4) Recursos administrativos disponíveis

- **Agenda**: criar, excluir e reordenar horários.
- **Palestrantes**: adicionar e remover com foto e bio.
- **Patrocinadores**: cadastrar por categoria com logo e link.
- **Moderação**: aprovar/rejeitar comentários, fotos e avaliações.

## 5) Persistência e uploads

- Dados do sistema: `data/db.json`
- Imagens uploadadas: `public/uploads`

## 6) Publicação (deploy)

### Vercel
1. Suba o repositório para GitHub.
2. Importe no Vercel.
3. Configure variáveis de ambiente (`ADMIN_USER`, `ADMIN_PASSWORD`, `AUTH_SECRET`).
4. Deploy.

### Netlify
1. Crie novo site a partir do Git.
2. Build command: `npm run build`
3. Publish directory: `.next`
4. Configure as variáveis de ambiente.

> Observação: em hospedagens serverless, persistência em arquivo local pode ser efêmera. Para produção de alto tráfego, substitua `data/db.json` por Supabase/Firebase.

## 7) SEO, acessibilidade e UX

- SEO básico com `metadata`.
- Layout responsivo com grid adaptável.
- Inputs com placeholders e estrutura semântica.
- Hover transitions suaves para cards.
