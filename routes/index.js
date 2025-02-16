const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Home route
router.get('/', (req, res) => {
    res.send('<h1>Welcome to Vulnerable App</h1><p>Go to <a href="/login">Login</a></p>');
});

// Login route
router.get('/login', (req, res) => {
    res.send('<form method="post" action="/login"><input name="username" placeholder="Username"/><input type="password" name="password" placeholder="Password"/><button type="submit">Login</button></form>');
});

router.post('/login', (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = require('crypto')
    .createHash('sha256')
    .update(password)
    .digest('hex');

    const query = 'SELECT username, password FROM users WHERE username = ? AND password = ?';

    db.query(query, [username, hashedPassword], (err, results) => {
        if (err) {
            console.error('Database query failed:', err);
            return res.status(500).send('An internal server error occurred');
        }

        if (results.length > 0) {
            req.session.user = results[0];
            res.send('Login successful!');
        } else {
            res.send('Invalid credentials!');
        }

    });
});

module.exports = router;
