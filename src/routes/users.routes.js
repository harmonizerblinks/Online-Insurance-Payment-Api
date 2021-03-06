module.exports = function(app) {

    var users = require('../controllers/user.controller.js');
    const verify = require('../middleware/verifyJwtToken.middleware.js');
    // const passport = require('passport');

    // Create a new User
    app.post('/api/users', verify.verifyToken, verify.isAdmin, users.create);

    // User Login or Authentication
    app.post('/api/login', users.login);

    // Retrieve all User
    app.get('/api/users', verify.verifyToken, users.findAll);

    // Retrieve all User
    app.get('/api/users/usertype/:type', verify.verifyToken, users.findAllByType);

    // Retrieve Current Login User Prodile
    // app.get('/api/profile', passport.authenticate('jwt', { session: false }), users.profile);

    // Retrieve a single User by Id
    app.get('/api/users/:userId', verify.verifyToken, users.findOne);

    // Retrieve a single User by username
    app.get('/api/users/username/:username', verify.verifyToken, users.findOneByUsername);

    // Update a User with Id
    app.put('/api/users/:userId', verify.verifyToken, verify.isAdmin, users.update);

    // Delete a User with Id
    app.delete('/api/users/:userId', verify.verifyToken, verify.isAdmin, users.delete);

}