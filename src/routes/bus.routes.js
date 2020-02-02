module.exports = function(app) {

    var bus = require('../controllers/bus.controller.js');
    const verify = require('../middleware/verifyJwtToken.middleware.js');
    // console.log('bus');

    // Create a new Bus
    app.post('/api/bus', verify.verifyToken, bus.create);

    // Retrieve all Bus
    app.get('/api/bus', verify.verifyToken, bus.findAll);

    // Retrieve a single Bus by Id
    app.get('/api/bus/:busId', verify.verifyToken, bus.findOne);

    // Update a Bus with Id
    app.put('/api/bus/:busId', verify.verifyToken, bus.update);

    // Delete a Bus with Id
    app.delete('/api/bus/:busId', verify.verifyToken, bus.delete);
}