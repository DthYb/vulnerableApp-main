const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Route pour afficher le formulaire d'inscription
router.get('/register', (req, res) => {
    res.send(`
        <form method="post" action="/register">
            <input type="hidden" name="_csrf" value="${req.csrfToken()}">
            <input name="username" placeholder="Username" required />
            <input type="password" name="password" placeholder="Password" required />
            <input type="password" name="confirmpassword" placeholder="Password" required />
            <button type="submit">Register</button>
        </form>
    `);
});

function validatePassword(password) {
    const minLength = 8;
    const uppercaseRegex = /[A-Z]/;
    const lowercaseRegex = /[a-z]/;
    const numberRegex = /[0-9]/;
    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;

    if (password.length < minLength) {
        return { valid: false, message: "Password must contain at least 8 characters." };
    }
    if (!uppercaseRegex.test(password)) {
        return { valid: false, message: "The password must contain at least one capital letter." };
    }
    if (!lowercaseRegex.test(password)) {
        return { valid: false, message: "The password must contain at least one lowercase letter." };
    }
    if (!numberRegex.test(password)) {
        return { valid: false, message: "The password must contain at least one digit." };
    }
    if (!specialCharRegex.test(password)) {
        return { valid: false, message: "The password must contain at least one special character." };
    }

    return { valid: true, message: "Password is valid." };
}


// Route pour gérer l'inscription
router.post('/register', (req, res) => {
    const { username, password, confirmpassword } = req.body;
    var usernamet = username.toString();
    var passwordt = password.toString();

    const validation = validatePassword(passwordt);
    if(!validation.valid){
        return res.status(400).send(validation.message);
    }
    
    if(passwordt != confirmpassword){
        return res.status(400).send('Passwords are required to be identical.');
    }

    if (!usernamet || !passwordt) {
        return res.status(400).send('Username and password are required.');
    }
    
    const hashedPassword = require('crypto')
    .createHash('sha256')
    .update(passwordt)
    .digest('hex');

    const query = 'INSERT INTO users (username, password) VALUES (?, ?)';

    db.query(query, [usernamet, hashedPassword], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('An error has occurred.');
        }
        res.send('Registration successful !');
    });
});

module.exports = router;
