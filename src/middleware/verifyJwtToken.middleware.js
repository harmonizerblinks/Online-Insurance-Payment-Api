const jwt = require('jsonwebtoken');
const config = require('../config/mongodb.config.js');
const User = require('../models/user.model.js');
const Role = require('../models/role.model.js');

verifyToken = async(req, res, next) => {
    // console.log(req.headers);
    // let token = req.headers['authorization'];
    let token = req.headers['x-access-token'] || req.headers['authorization']; // Express headers are auto converted to lowercase
    console.log(token);
    if (token.startsWith('Bearer ')) {
        // Remove Bearer from string
        token = token.slice(7, token.length);
    }
    console.log(token);
    if (!token) {
        return res.status(403).send({
            auth: false,
            message: 'No token provided.'
        });
    }

    jwt.verify(token, config.secret, async(err, decoded) => {
        if (err) {
            return res.status(500).send({
                auth: false,
                message: 'Fail to Authentication. Error -> ' + err
            });
        }
        // console.log(decoded);
        req.user = decoded.data;
        req.body.muserid = decoded.data.id;
        if (req.body.userid == null) { req.body.userid = decoded.data.id; }
        if (req.body.code == null) {
            req.body.code = await generateOTP(6);
            console.log(req.body.code);
        }
        // console.log(req.body);

        next();
    });
}

isAdmin = (req, res, next) => {

    User.findById(req.user._id)
        .exec((err, user) => {
            if (err) {
                if (err.kind === 'ObjectId') {
                    return res.status(404).send({
                        message: "User not found with Username = " + req.body.username
                    });
                }
                return res.status(500).send({
                    message: "Error retrieving User with Username = " + req.body.username
                });
            }

            Role.find({
                '_id': { $in: user.roles }
            }, (err, roles) => {
                if (err)
                    res.status(500).send("Error -> " + err);

                for (let i = 0; i < roles.length; i++) {
                    if (roles[i].name.toUpperCase() === "ADMIN") {
                        next();
                        return;
                    }
                }

                res.status(403).send("Require Admin Role!");
                return;
            });
        });
}

isPmOrAdmin = (req, res, next) => {
    User.findOne({ _id: req.userId })
        .exec((err, user) => {
            if (err) {
                if (err.kind === 'ObjectId') {
                    return res.status(404).send({
                        message: "User not found with Username = " + req.body.username
                    });
                }
                return res.status(500).send({
                    message: "Error retrieving User with Username = " + req.body.username
                });
            }

            Role.find({
                '_id': { $in: user.roles }
            }, (err, roles) => {
                if (err)
                    res.status(500).send("Error -> " + err);

                for (let i = 0; i < roles.length; i++) {
                    let role = roles[i].name.toUpperCase();
                    if (role === "PM" || role === "ADMIN") {
                        next();
                        return;
                    }
                }

                res.status(403).send("Require PM or Admin Roles!");
                return;
            });
        });
}

const authJwt = {
    verifyToken: verifyToken,
    isAdmin: isAdmin,
    isPmOrAdmin: isPmOrAdmin
};

module.exports = authJwt;

async function generateOTP(length) {
    var digits = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    var otpLength = length;
    var otp = '';

    for (let i = 1; i <= otpLength; i++) {
        var index = Math.floor(Math.random() * (digits.length));

        otp = otp + digits[index];
    }
    return otp.toUpperCase();
}