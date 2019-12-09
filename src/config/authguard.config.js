const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/users.model.js');
const config = require('./mongodb.config.js');

module.exports = (passport) => {
    // var passport = require('passport'),
    //     LocalStrategy = require('passport-local').Strategy;

    // passport.use(new LocalStrategy(
    //     function(username, password, done) {
    //         User.findOne({ username: username }, function(err, user) {
    //             if (err) { return done(err); }
    //             if (!user) {
    //                 return done(null, false, { message: 'Incorrect username.' });
    //             }
    //             if (!user.validPassword(password)) {
    //                 return done(null, false, { message: 'Incorrect password.' });
    //             }
    //             return done(null, user);
    //         });
    //     }
    // ));
    let opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    opts.secretOrKey = config.secret;
    console.log(opts);
    passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
        User.findById(jwt_payload.data._id, (err, user) => {
            if (err) return done(err, false);
            if (user) return done(null, user);

            console.log(user);
            return done(null, false);
        })
    }));
}