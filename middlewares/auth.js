const jwt = require('jsonwebtoken');
const { read } = require('../utils/file');

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      return res.status(401).json({ error: 'No token provided' });
    }

    // Ensure token is in "Bearer <token>" format
    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Verify JWT
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'defaultsecret');

    // Read users from file (async-safe)
    const users = await read('users');
    const user = users.find(u => u.id === payload.userId);

    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Attach user to request object
    req.user = user;

    // Continue to next middleware / route
    next();
  } catch (err) {
    console.log("JWT error:", err.message); // Optional for debugging
    res.status(401).json({ error: 'Invalid token' });
  }
};
