# Hammad Pirzada Portfolio

React portfolio with a small Node.js contact API.

## Run locally

1. Open this folder in VS Code.
2. In the terminal, run `npm install`.
3. Run `npm run dev`.
4. Open the local address printed by Vite.

The contact API runs alongside Vite. Until SMTP values are added to `.env`, the form explains that it is not configured and offers LinkedIn as a fallback.

## Connect email delivery

Copy `.env.example` to `.env`, then fill in `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `MAIL_FROM`, and `CONTACT_EMAIL` with values from the email provider you choose. Keep `.env` private; it is ignored by Git.

## Production

Run `npm run build`, configure the same environment variables on a Node.js hosting provider, then start the server with `npm start`. This project uses React Router, so the Node server serves the React app for page routes and handles `/api/contact`.
