const express = require('express');
const bodyParser = require('body-parser');

const usersRoute = require('./routes/users');
const authRoute = require('./routes/auth');
const linksRoute = require('./routes/links');

const app = express();
app.use(bodyParser.json());

app.use('/users', usersRoute);
app.use('/auth', authRoute);
app.use('/links', linksRoute);

app.listen(3000, () => console.log('Server running on port 3000'));


const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));