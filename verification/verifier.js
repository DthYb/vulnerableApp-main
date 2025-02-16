function ensureAuthenticated(req, res, next) {
    if (req.session.user) {
        return next();
    }
    res.status(401).send('You cannot post a comment as you are not logged in.');
}

module.exports = ensureAuthenticated;