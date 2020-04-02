module.exports = function(app) {

    var package = require('../controllers/package.controller.js');
    const verify = require('../middleware/verifyJwtToken.middleware.js');
    // console.log('package');

    // Create a new Insurance
    app.post('/api/package', verify.verifyToken, package.create);

    // Retrieve all Insurance
    app.get('/api/package', verify.verifyToken, package.findAll);

    // Retrieve a single Insurance by Id
    app.get('/api/package/:packageId', verify.verifyToken, package.findOne);

    // Update a Insurance with Id
    app.put('/api/package/:packageId', verify.verifyToken, package.update);

    // Delete a Insurance with Id
    app.delete('/api/package/:packageId', verify.verifyToken, package.delete);
}