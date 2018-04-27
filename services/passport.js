const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('../config/keys.js');

// it gives access to Mongoose Model Class Users
const User = mongoose.model('users');

/**
 * Configuring passport to treat the Cookie serialization and 
 * deserialization.
 * 
 * The 'user' is the retrieved/authenticated user that we
 * have work with on our GoogleStrategy callback function.
 * 
 */
passport.serializeUser((user, done) => {
    // This user.id, is the id generated on the Users Collection, on MongoDB.
    // It isn't the profile.id.
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id)
        .then(user => {
            done(null, user);
        });
});

passport.use(
    new GoogleStrategy(
        {
            clientID: keys.googleClientID,
            clientSecret: keys.googleClientSecret,
            callbackURL: '/auth/google/callback',
            proxy: true
        },
        (accessToken, refreshToken, profile, done) => {
            /**
             * This is the callback function called after 
             * Google have validated with the user through 
             * OAuth.
             * 
             * DONE - Passport's callback
             *  Take a look that, after retrieving the user 
             *  from the datasource, or after creating it,
             *  we are calling the function DONE. 
             * 
             *  Here, DONE is a Passport's Callback function
             *  used to tell Passport that our callback is 
             *  finished successfully. 
             * 
             *  Take a look that we are sending null as the first 
             *  argument (the error first argument) and the created 
             *  user or the retrieved used, if it is the case.
             */
            User.findOne({ googleId : profile.id })
                .then((existingUser) => {
                    if (existingUser) {
                        done(null, existingUser);
                    } else {
                        new User({ googleId : profile.id })
                            .save()
                            .then(user => done(null, user));
                    }
                });
        }
    )
);