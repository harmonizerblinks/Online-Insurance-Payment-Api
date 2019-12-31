module.exports = function(app) {

    var location = require('../controllers/location.controller.js');
    const verify = require('../middleware/verifyJwtToken.middleware.js');
    // console.log('location');

    // Create a new Region
    app.post('/api/locations', verify.verifyToken, location.create);

    // Retrieve all Region
    app.get('/api/locations', verify.verifyToken, location.findAll);

    // Retrieve a single Region by Id
    app.get('/api/locations/:locationId', verify.verifyToken, location.findOne);

    // Update a Region with Id
    app.put('/api/locations/:locationId', verify.verifyToken, location.update);

    // Delete a Region with Id
    app.delete('/api/locations/:locationId', verify.verifyToken, location.delete);
}