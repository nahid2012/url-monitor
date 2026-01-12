const express = require('express');

const usersRoute = require('./routes/users');
const authRoute = require('./routes/auth');
const linksRoute = require('./routes/links');

const app = express();
app.use(express.json());

const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));

app.use('/users', usersRoute);
app.use('/auth', authRoute);
app.use('/links', linksRoute);

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));