const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { read } = require('../utils/file');

const router = express.Router();

// Login
// router.post('/login', (req, res) => {
//   const { phone, password } = req.body;
//   const users = read('users');
//   const user = users.find(u => u.phone === phone);
//   if (!user) return res.status(404).json({ error: 'User not found' });

//   if (!bcrypt.compareSync(password, user.password)) return res.status(401).json({ error: 'Wrong password' });

//   const token = jwt.sign({ userId: user.id }, 'secretkey', { expiresIn: '1h' });
//   res.json({ token, expiresIn: 3600 });
// });



router.post('/login', async (req, res) => {    // <-- async
  const { phone, password } = req.body;

  const users = await read('users');          // <-- await the promise
  const user = users.find(u => u.phone === phone);
  if (!user) return res.status(404).json({ error: 'User not found' });

  if (!bcrypt.compareSync(password, user.password))
    return res.status(401).json({ error: 'Wrong password' });

  const token = jwt.sign({ userId: user.id }, 'secretkey', { expiresIn: '1h' });
  res.json({ token, expiresIn: 3600 });
});


module.exports = router;
