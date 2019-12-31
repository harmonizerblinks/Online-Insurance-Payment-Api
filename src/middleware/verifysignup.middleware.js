const config = require('../config/config.js');
const ROLEs = config.ROLEs;
const User = require('../model/user.model.js');

checkDuplicateUserNameOrEmail = (req, res, next) => {
    // -> Check Username is already in use

    User.findOne({ username: req.body.username })
        .exec((err, user) => {
            if (err && err.kind !== 'ObjectId') {
                res.status(500).send({
                    message: "Error retrieving User with Username = " + req.body.username
                });
                return;
            }

            if (user) {
                res.status(400).send({ message: "Fail -> Username is already taken!" });
                return;
            }

            User.findOne({ email: req.body.email })
                .exec((err, user) => {
                    if (err && err.kind !== 'ObjectId') {
                        res.status(500).send({
                            message: "Error retrieving User with Email = " + req.body.email
                        });
                        return;
                    }

                    if (user) {
                        res.status(400).send("Fail -> Email is already in use!");
                        return;
                    }

                    next();
                });
        });
}

checkRolesExisted = (req, res, next) => {
    for (let i = 0; i < req.body.roles.length; i++) {
        if (!ROLEs.includes(req.body.roles[i].toUpperCase())) {
            res.status(400).send("Fail -> Does NOT exist Role = " + req.body.roles[i]);
            return;
        }
    }
    next();
}

const signUpVerify = {
    checkDuplicateUserNameOrEmail,
    checkRolesExisted
};
// signUpVerify.checkDuplicateUserNameOrEmail = checkDuplicateUserNameOrEmail;
// signUpVerify.checkRolesExisted = checkRolesExisted;

module.exports = signUpVerify;