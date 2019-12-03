const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/users.model.js');
const config = require('./mongodb.config.js');

module.exports = (passport) => {
    let opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('Bearer')
    opts.secretOrKey = config.secret;
    passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
        User.findById(jwt_payload.data._id, (err, user) => {
                if (err) return done(err, false);
                if (user) return done(null, user);

                console.log(user);
                return done(null, false);
            })
            // .then(user => {
            //     if (!user) {
            //         return res.status(501).send({
            //             message: "Authentication Token not Valid"
            //         });
            //     }
            //     return done(null, false);
            // }).catch(err => {
            //     if (err.kind === 'ObjectId') {
            //         return res.status(404).send({
            //             message: "Invalid Token Used to Access Resources"
            //         });
            //     }
            //     return res.status(500).send({
            //         message: "Error retrieving Authenticated User With token id " + jwt_payload.data._id
            //     });
            // });
    }));
}