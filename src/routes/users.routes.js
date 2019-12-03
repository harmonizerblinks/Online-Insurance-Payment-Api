module.exports = function(app) {

    var users = require('../controllers/users.controller.js');
    const passport = require('passport');

    // Create a new User
    app.post('/api/users', users.create);

    // User Login or Authentication
    app.post('/api/login', users.login);

    // Retrieve all User
    app.get('/api/users', users.findAll);

    // Retrieve Current Login User Prodile
    app.get('/api/profile', users.profile);

    // Retrieve a single User by Id
    app.get('/api/users/:userId', users.findOne);

    // Retrieve a single User by username
    app.get('/api/users/username/:username', users.findOneByUsername);

    // Update a User with Id
    app.put('/api/users/:userId', users.update);

    // Delete a User with Id
    app.delete('/api/users/:userId', users.delete);
}