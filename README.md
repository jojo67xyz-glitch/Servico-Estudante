# Servico de Estudante (servico-estudante)

## Backend SQLite

O backend fica em `server/index.js` e cria automaticamente a base `database/servico-estudante.sqlite`.

1. Copie `.env.example` para `.env`.
2. Inicie a API com `npm run server`.
3. Inicie o frontend com `npm run dev`.

A API fica disponível em `http://localhost:3000` e inclui autenticação, perfil, mensagens e upload de fotos, vídeos e documentos. O ficheiro `database/schema.sql` é aplicado automaticamente.

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
