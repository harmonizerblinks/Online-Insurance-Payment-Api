module.exports = function(app) {

    var redirect = require('../controllers/redirect.controller.js');
    const verify = require('../middleware/verifyJwtToken.middleware.js');
    // console.log('redirect');

    // Create a new redirect
    app.get('/redirect/completed', redirect.Completed);
    app.get('/redirect/quotafull', redirect.Partial);
    app.get('/redirect/terminate', redirect.Terminated);

    // Retrieve all redirect
    app.get('/api/redirect', verify.verifyToken, redirect.findAll);

    // Retrieve a single redirect by Id
    app.get('/api/redirect/:redirectId', verify.verifyToken, verify.isAdmin, redirect.findOne);

    // Update a redirect with Id
    app.put('/api/redirects/:redirectId', verify.verifyToken, verify.isAdmin, redirect.update);

    // Delete a redirect with Id
    app.delete('/api/redirects/:redirectId', verify.verifyToken, verify.isAdmin, redirect.delete);
}