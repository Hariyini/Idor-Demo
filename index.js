// index.js
const { ensureSameUser } = require('./auth');
const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();

app.use(express.json());
app.use(cookieParser());

// Fake "database" of users
const users = {
  "1": { id: "1", name: "Alice", email: "alice@example.com" },
  "2": { id: "2", name: "Bob", email: "bob@example.com" }
};

// ----------------------
// Login endpoint (naive, for demo only)
app.post('/login', (req, res) => {
  const { userId } = req.body;
  if (!users[userId]) return res.status(400).json({ error: 'Invalid userId' });
  
  // Set a simple session cookie
  res.cookie('session_user', userId, { httpOnly: true });
  res.json({ message: `Logged in as user ${userId}` });
});

// ----------------------
// VULNERABLE: returns any user's profile without checking session
app.get('/profile/:id',ensureSameUser, (req, res) => {
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
