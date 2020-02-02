module.exports = function(app) {

    var rent = require('../controllers/rent.controller.js');
    const verify = require('../middleware/verifyJwtToken.middleware.js');
    // console.log('rent');

    // Create a new Rent
    app.post('/api/rents', verify.verifyToken, rent.create);

    // Retrieve all Rent
    app.get('/api/rents', verify.verifyToken, rent.findAll);

    // Retrieve a single Rent by Id
    app.get('/api/rents/:rentId', verify.verifyToken, rent.findOne);

    // Update a Rent with Id
    app.put('/api/rents/:rentId', verify.verifyToken, rent.update);

    // Delete a Rent with Id
    app.delete('/api/rents/:rentId', verify.verifyToken, rent.delete);
}