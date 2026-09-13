# Yarn Admin (Studio Desk)

Boutique admin dashboard for the Yarn storefront — same tokens and visual language as Client.

## Develop

```bash
cd Admin
npm install
npm run dev
```

Mock login: any non-empty email + password (defaults prefilled).

## Features

- Overview stats
- Products CMS (create / edit / draft / featured)
- Orders list + status updates
- Storefront content editor (full marketing copy + images, nested `SiteContent` for future APIs)
- Custom requests inbox

Data persists in `localStorage` (browser only). Content key: `yarn-admin:content-v3`. Swap `loadJson`/`saveJson` for HTTP when backend APIs land.

Images can be pasted as a URL/path or uploaded from the device. Uploads open a cropper locked to the storefront aspect ratio for that slot (e.g. products/hero **4∶5**, maker **3∶4**, logo **8∶5**, QR **1∶1**). Cropped images are stored locally as data URLs until a media API exists.
