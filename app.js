require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const mysql = require('mysql2');
const cookieParser = require('cookie-parser');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
}));

//(https://www.geeksforgeeks.org/how-to-use-connection-pooling-with-mysql-in-nodejs/)
// Database connection (createPool to add connection Limit)
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

pool.getConnection((err, connection) => {
    if (err) {
        console.error('Connection error :', err);
    } else {
        console.log('Connected !');
        connection.release();
    }
});

// Routes
app.use('/', require('./routes/index'));
app.use('/', require('./routes/auth')); // Ajout des routes d'authentification
app.use('/', require('./routes/comments')); // Ajout des routes des commentaires

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
