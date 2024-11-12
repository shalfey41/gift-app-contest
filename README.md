This is a project for [full-stack developers contest](https://t.me/CryptoBotRU/365) from Crypto Bot.

Basically, it's built on Next.js + Prisma ORM + MongoDB and deployed on Vercel.

Tools used:

- Connection with Telegram Bot — [grammY](https://github.com/grammyjs/grammY).
- Connection with Crypto Bot — [crypto-bot-api](https://github.com/sergeiivankov/crypto-bot-api).
- Connection between website and Telegram — [@twa-dev/sdk](https://github.com/twa-dev/SDK).
- Animations — [framer motion](https://github.com/framer/motion).
- Lottie animations — [lottie-react](https://github.com/Gamote/lottie-react).
- Internationalization — [react-i18next](https://github.com/i18next/react-i18next).

# Architecture and User Flow

I described the backend architecture and the whole user flow in [Figma, so please welcome](https://www.figma.com/design/8cFC8sHBM5qoCXLRYQEEIu/Untitled?node-id=0-1&t=VVBG4BEpS4Aj2t6Y-1).

# How to run

You need to have a bunch of things to run this project:

- MongoDB database
- Telegram bot and API token
- Crypto Bot API token
- Ngrok

First, install the dependencies:

```bash
npm install
```

Copy env.example to .env and fill in the variables.

Run the development server:

```bash
npm run dev
```

Connect it with Ngrok:

```bash
ngrok http 3000
```

Take the HTTPS link and paste it to the Telegram bot to receive webhooks. The application listen to the `/bot` endpoint.

Take the HTTPS link and paste it to the Crypto bot to receive webhooks. The application listen to the `/cryptopay` endpoint.
