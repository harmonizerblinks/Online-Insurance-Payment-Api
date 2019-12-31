module.exports = function(app) {

    var rent = require('../controllers/rent.controller.js');
    const verify = require('../middleware/verifyJwtToken.middleware.js');
    // console.log('rent');

    // Create a new Rent
    app.post('/api/rents', rent.create);

    // Retrieve all Rent
    app.get('/api/rents', rent.findAll);

    // Retrieve a single Rent by Id
    app.get('/api/rents/:rentId', rent.findOne);

    // Update a Rent with Id
    app.put('/api/rents/:rentId', rent.update);

    // Delete a Rent with Id
    app.delete('/api/rents/:rentId', rent.delete);
}