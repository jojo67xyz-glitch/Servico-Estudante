# Servico de Estudante (servico-estudante)

## Backend MySQL

O backend fica em `server/index.js` e a estrutura da base de dados está em `database/schema.sql`.

1. Abra o XAMPP e inicie o módulo `MySQL`.
2. Aceda a `http://localhost/phpmyadmin` e importe `database/schema.sql`.
3. Copie `.env.example` para `.env`. No XAMPP padrão, deixe `DB_PASSWORD` vazio.
4. Inicie a API com `npm run server`.
5. Inicie o frontend com `npm run dev`.

A API fica disponível em `http://localhost:3000` e inclui autenticação, perfil, mensagens e upload de fotos, vídeos e documentos.

## Install the dependencies

```bash
pnpm install
# or: yarn/npm/bun install
```

### Start the app in development mode (HMR, error reporting, etc.)

```bash
quasar dev
```

### Format & Lint the files

```bash
pnpm run lint
# or: yarn/npm/bun run lint
```

...or just check formatting & linting:

```bash
pnpm run lint:check
# or: yarn/npm/bun run lint:check
```

### Build the app for production

```bash
quasar build
```

### Customize the configuration

See [Configuring quasar.config.js](https://v2.quasar.dev/quasar-cli-vite/quasar-config-file).
