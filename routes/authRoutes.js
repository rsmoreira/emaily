const passport = require('passport');

// this line below allows that app, crated into the index.js, can be used here.
module.exports = (app) => {

    // Google OAuth Passport Strategy Routes
    // Route to get authenticated with google
    app.get(
        '/auth/google', 
        passport.authenticate('google', {
            scope: ['profile', 'email']
        })
    );

    app.get(
        '/auth/google/callback',
        passport.authenticate('google')
    );
    
    // Route to logout
    app.get('/api/logout', (req, res) => {
        req.logout();
        res.send(req.user);
    })


    // Route to show current_use data
    app.get('/api/current_user', (req, res) => {
        res.send(req.user);
    });

};