const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { escapeHTML } = require('../escapehtml'); 

// Middleware pour s'assurer que l'utilisateur est authentifié
const ensureAuthenticated = require('../verification/verifier');

// Route pour afficher les commentaires et le formulaire
router.get('/comments', (req, res) => {
    db.query('SELECT * FROM comments', (err, results) => {
        if (err) throw err;

        const commentsHTML = results
            .map(comment => `<p>${escapeHTML(comment.text)}</p>`)
            .join('');

        res.send(`
            <form method="post" action="/comments">
                <textarea name="text" placeholder="Your comment"></textarea>
                <button type="submit">Post Comment</button>
            </form>
            ${commentsHTML}
        `);
    });
});

// Route pour ajouter un commentaire
router.post('/comments', ensureAuthenticated, (req, res) => {
    const { text } = req.body;

    // Validation des entrées
    if (!text || text.trim() === '') {
        return res.status(400).send('Comment cannot be empty.');
    }

    const query = 'INSERT INTO comments (text) VALUES (?)';
    db.query(query, [text], (err) => {
        if (err) throw err;
        res.redirect('/comments');
    });
});

module.exports = router;
