module.exports = function(app) {

    var package = require('../controllers/package.controller.js');
    const verify = require('../middleware/verifyJwtToken.middleware.js');
    // console.log('package');

    // Create a new Insurance
    app.post('/api/packages', verify.verifyToken, verify.isAdmin, package.create);

    // Retrieve all Insurance
    app.get('/api/packages', verify.verifyToken, package.findAll);

    // Retrieve a single Insurance by Id
    app.get('/api/packages/:packageId', verify.verifyToken, verify.isAdmin, package.findOne);

    // Update a Insurance with Id
    app.put('/api/packages/:packageId', verify.verifyToken, verify.isAdmin, package.update);

    // Delete a Insurance with Id
    app.delete('/api/packages/:packageId', verify.verifyToken, verify.isAdmin, package.delete);
}