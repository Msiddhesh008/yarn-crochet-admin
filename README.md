# Yarn Admin (Studio Desk)

Boutique admin dashboard for the Yarn storefront — same tokens and visual language as Client.

## Develop

Start the API first (`Server/`), then:

```bash
cd Admin
npm install
cp .env.example .env   # VITE_API_URL=http://localhost:4000
npm run dev
```

Login: `hello@yarn.studio` / `handmade` (from Server `.env`).

## Features

- Overview stats
- Products CMS (create / edit / draft / featured) via API
- Orders list + status updates (still local mock until checkout)
- Storefront content editor synced to API
- Custom requests inbox from API

Images can be pasted as a URL/path or uploaded (cropped data URLs stored until a media API exists).
