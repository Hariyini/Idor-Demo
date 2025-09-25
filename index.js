// index.js
const express = require('express');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const csurf = require('csurf');
const { ensureSameUser } = require('./auth');

const app = express();

// ----------------------
// Security middleware
app.use(helmet());                // Adds secure HTTP headers
app.use(express.json());           // Parse JSON request bodies
app.use(cookieParser());           // Parse cookies

// CSRF protection (using cookies)
app.use(csurf({ cookie: true }));

// CSRF error handler
app.use((err, req, res, next) => {
  if (err.code === 'EBADCSRFTOKEN') {
    return res.status(403).json({ error: 'Invalid CSRF token' });
  }
  next(err);
});

// ----------------------
// Fake "database" of users
const users = {
  "1": { id: "1", name: "Alice", email: "alice@example.com" },
  "2": { id: "2", name: "Bob", email: "bob@example.com" }
};

// ----------------------
// Default route
app.get('/', (req, res) => {
  res.send('IDOR demo server is running. Use /login and /profile/:id routes.');
});

// ----------------------
// Login endpoint (naive, for demo only)
app.post('/login', (req, res) => {
  const { userId } = req.body;
  if (!users[userId]) return res.status(400).json({ error: 'Invalid userId' });

  // Set a secure session cookie
  res.cookie('session_user', userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    sameSite: 'strict'                              // CSRF protection
  });

  res.json({ message: `Logged in as user ${userId}` });
});

// Endpoint to get CSRF token for clients
app.get('/csrf-token', (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// ----------------------
// Protected profile endpoint
app.get('/profile/:id', ensureSameUser, (req, res) => {
  const id = req.params.id;
  const user = users[id];
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

// ----------------------
app.listen(3000, () => console.log('Listening on http://localhost:3000'));
app.get('/', (req, res) => {
  res.send('IDOR demo server is running. Use /login and /profile/:id routes.');
});
