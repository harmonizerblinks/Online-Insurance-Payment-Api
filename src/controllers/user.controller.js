const User = require('../models/user.model.js');
// const passport = require('passport');
// const jwt = require('jsonwebtoken');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../config/mongodb.config.js');


// POST a User
exports.create = async(req, res) => {
    // console.log(req.body);
    // Create a User
    const user = new User(req.body);
    user.password = bcrypt.hashSync(req.body.password, 10),

        await user.save()
        .then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};

exports.login = (req, res) => {
    const username = req.body.username;
    const password = req.body.password

    const query = { username };
    User.findOne(query)
        .then(user => {
            if (!user) {
                return res.status(404).send({
                    message: "User not found with username " + username
                });
            }

            var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
            if (passwordIsValid) {
                const token = jwt.sign({
                    type: 'user',
                    data: {
                        id: user._id,
                        fullname: user.fullname,
                        username: user.username,
                        mobile: user.mobile,
                        email: user.email,
                        roles: user.roles
                    },
                }, config.secret, {
                    expiresIn: 684800
                });
                res.send({ success: true, access_token: token, date: Date.now });
            } else {
                res.status(500).send({ success: false, message: 'Password is not correct' })
            }
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "User not found with username " + username
                });
            }
            return res.status(500).send({
                message: "Error retrieving User with username " + username
            });
        });
};


exports.changepassword = (req, res) => {
    const id = req.body.userid;
    const oldpassword = req.body.password;
    const password = req.body.newpassword;

    User.findById(id)
        .then(user => {
            if (!user) {
                return res.status(404).send({
                    message: "User not found with username " + username
                });
            }

            var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
            if (passwordIsValid) {
                user.password = bcrypt.hashSync(req.body.newpassword, 10);

                User.findByIdAndUpdate(id, user, { new: true })
                    .then(use => {
                        if (!use) {
                            return res.status(404).send({
                                message: "User not found with id " + req.params.userId
                            });
                        }
                        res.send({
                            message: "Password Changed successfully"
                        });
                    }).catch(err => {
                        if (err.kind === 'ObjectId') {
                            return res.status(404).send({
                                message: "Invalid User "
                            });
                        }
                        console.log(err);
                        return res.status(500).send({
                            message: "Error updating user Password "
                        });
                    });
            } else {
                res.status(500).send({ success: false, message: 'Password is not correct' })
            }
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "User not found with username " + username
                });
            }
            return res.status(500).send({
                message: "Error retrieving User with username " + username
            });
        });
};

exports.profile = (req, res) => {
    if (req.user) {
        res.send(req.user);
    } else {
        res.status(500).send({
            message: "Authentication not Valid"
        });
    }
};

// FETCH all Users
exports.findAll = (req, res) => {
    console.log('fine All');
    User.find()
        .then(users => {
            // console.log(users)
            res.send(users);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};

// FETCH all Users With Usertype
exports.findAllByType = (req, res) => {
    console.log('fine All by type');
    const query = { usertype: req.params.type };
    User.find(query)
        .then(users => {
            // console.log(users)
            res.send(users);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};


// FIND a User
exports.findOne = (req, res) => {
    User.findById(req.params.userId)
        .then(user => {
            if (!user) {
                return res.status(404).send({
                    message: "User not found with id " + req.params.userId
                });
            }
            res.send(user);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "User not found with id " + req.params.userId
                });
            }
            return res.status(500).send({
                message: "Error retrieving User with id " + req.params.userId
            });
        });
};

// Find User By username 
exports.findOneByUsername = (req, res) => {
    const query = { username: req.params.username }
    User.findOne(query)
        .then(user => {
            if (!user) {
                return res.status(404).send({
                    message: "User not found with username " + req.params.username
                });
            }
            res.send(user);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "User not found with username " + req.params.username
                });
            }
            return res.status(500).send({
                message: "Error retrieving User with username " + req.params.username
            });
        });
};

// UPDATE a User
exports.update = (req, res) => {
    var user = req.body;
    user.updated = Date.now;
    // Find user and update it
    console.log(req.body)
    User.findByIdAndUpdate(req.params.userId, user, { new: true })
        .then(user => {
            if (!user) {
                return res.status(404).send({
                    message: "User not found with id " + req.params.userId
                });
            }
            res.send(user);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "User not found with id " + req.params.userId
                });
            }
            console.log(err);
            return res.status(500).send({
                message: "Error updating user with id " + req.params.userId
            });
        });
};

// DELETE a User
exports.delete = (req, res) => {
    User.findByIdAndRemove(req.params.userId)
        .then(user => {
            if (!user) {
                return res.status(404).send({
                    message: "User not found with id " + req.params.userId
                });
            }
            res.send({ message: "User deleted successfully!" });
        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: "User not found with id " + req.params.userId
                });
            }
            return res.status(500).send({
                message: "Could not delete user with id " + req.params.userId
            });
        });
};