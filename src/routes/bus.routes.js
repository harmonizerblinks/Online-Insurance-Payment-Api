module.exports = function(app) {

    var bus = require('../controllers/bus.controller.js');
    const verify = require('../middleware/verifyJwtToken.middleware.js');
    // console.log('bus');

    // Create a new Bus
    app.post('/api/bus', bus.create);

    // Retrieve all Bus
    app.get('/api/bus', bus.findAll);

    // Retrieve a single Bus by Id
    app.get('/api/bus/:busId', bus.findOne);

    // Update a Bus with Id
    app.put('/api/bus/:busId', bus.update);

    // Delete a Bus with Id
    app.delete('/api/bus/:busId', bus.delete);
}