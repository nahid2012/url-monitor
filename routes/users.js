const express = require('express');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { read, write } = require('../utils/file');
const auth = require('../middlewares/auth');

const router = express.Router();

// Get logged-in user profile
router.get('/me', auth, (req, res) => {
  const { password, ...safeUser } = req.user; // hide password
  res.json({ user: safeUser });
});


// Create user
router.post('/', async (req, res) => {
  const { name, phone, password } = req.body;
  if (!name || !phone || !password) return res.status(400).json({ error: 'Missing fields' });

  const users = await read('users');
  if (users.find(u => u.phone === phone)) return res.status(400).json({ error: 'User exists' });

  const hashed = await bcrypt.hash(password, 8);
  const user = { id: uuidv4(), name, phone, password: hashed };
  users.push(user);
  await write('users', users);
  res.json({ message: 'User created', userId: user.id });
});


// Delete user
router.delete('/:id', auth, async (req, res) => {
  let users = await read('users');
  const index = users.findIndex(u => u.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'User not found' });
  users.splice(index, 1);
  await write('users', users);
  res.json({ message: 'User deleted' });
});

module.exports = router;
