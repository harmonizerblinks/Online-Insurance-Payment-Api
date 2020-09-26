const User = require('../models/user.model.js');


// POST a User
exports.create = async(req, res) => {
    // console.log(req.body);
    // Create a User
    const user = new User(req.body);

        await user.save()
        .then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
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