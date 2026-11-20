import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import nodemailer from 'nodemailer';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const app = express();
const port = Number(process.env.PORT || process.env.API_PORT || 3001);
const rootDir = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(rootDir, 'dist');

app.disable('x-powered-by');
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      baseUri: ["'self'"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'", 'https://fonts.gstatic.com', 'data:'],
      formAction: ["'self'"],
      frameAncestors: ["'none'"],
      imgSrc: ["'self'", 'data:'],
      objectSrc: ["'none'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", 'https://fonts.googleapis.com'],
      upgradeInsecureRequests: process.env.NODE_ENV === 'production' ? [] : null,
    },
  },
}));
app.use(express.json({ limit: '12kb' }));

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many messages were sent. Please try again in a few minutes.' },
});

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/contact', contactLimiter, async (req, res) => {
  const { name, email, projectType, message, website } = req.body ?? {};

  // Quietly accept bot honeypot submissions without forwarding their content.
  if (typeof website === 'string' && website.trim()) {
    return res.status(200).json({ message: 'Thanks for your note.' });
  }

  const cleanName = typeof name === 'string' ? name.trim().replace(/[\r\n]+/g, ' ') : '';
  const cleanEmail = typeof email === 'string' ? email.trim() : '';
  const cleanType = typeof projectType === 'string' ? projectType.trim() : '';
  const cleanMessage = typeof message === 'string' ? message.trim() : '';
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail);
  const allowedProjectTypes = new Set(['Business website', 'E-commerce store', 'Web application', 'Design collaboration', 'Something else']);

  if (cleanName.length < 2 || cleanName.length > 100 || !validEmail || cleanEmail.length > 200 || !allowedProjectTypes.has(cleanType) || cleanMessage.length < 15 || cleanMessage.length > 3000) {
    return res.status(400).json({ error: 'Please check your name, email and message, then try again.' });
  }

  const requiredMailSettings = ['SMTP_HOST', 'SMTP_USER', 'SMTP_PASS', 'MAIL_FROM', 'CONTACT_EMAIL'];
  const missingSettings = requiredMailSettings.filter((setting) => !process.env[setting]);
  if (missingSettings.length) {
    return res.status(503).json({ error: 'The contact form is not connected yet. Email hammadpirxada@gmail.com or call / WhatsApp 0370 3426757.' });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === 'true',
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });

    await transporter.sendMail({
      from: process.env.MAIL_FROM,
      to: process.env.CONTACT_EMAIL,
      replyTo: { name: cleanName, address: cleanEmail },
      subject: `Portfolio inquiry: ${(cleanType || 'New project').replace(/[\r\n]+/g, ' ').slice(0, 80)}`,
      text: `Name: ${cleanName}\nEmail: ${cleanEmail}\nProject type: ${cleanType || 'Not specified'}\n\n${cleanMessage}`,
    });

    return res.status(200).json({ message: 'Your message has been sent. Thanks for reaching out.' });
  } catch (error) {
    console.error('Contact email delivery failed:', error.message);
    return res.status(502).json({ error: 'The message could not be delivered just now. Please try again or contact me on LinkedIn.' });
  }
});

app.all(/^\/api(?:\/|$)/, (_req, res) => {
  res.status(404).json({ error: 'API endpoint not found.' });
});

if (existsSync(distDir)) {
  app.use(express.static(distDir));
  app.get(/.*/, (_req, res) => res.sendFile(path.join(distDir, 'index.html')));
}

app.use((error, _req, res, _next) => {
  if (error?.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Invalid JSON request.' });
  }
  console.error('Request failed:', error.message);
  return res.status(500).json({ error: 'Something went wrong. Please try again.' });
});

app.listen(port, () => {
  console.log(`Portfolio API running on http://localhost:${port}`);
});
