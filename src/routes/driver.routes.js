module.exports = function(app) {

    var driver = require('../controllers/driver.controller.js');
    const verify = require('../middleware/verifyJwtToken.middleware.js');
    // console.log('driver');

    // Create a new Driver
    app.post('/api/drivers', verify.verifyToken, driver.create);

    // Retrieve all Driver
    app.get('/api/drivers', verify.verifyToken, driver.findAll);

    // Retrieve a single Driver by Id
    app.get('/api/drivers/:driverId', verify.verifyToken, driver.findOne);

    // Update a Driver with Id
    app.put('/api/drivers/:driverId', verify.verifyToken, driver.update);

    // Delete a Driver with Id
    app.delete('/api/drivers/:driverId', verify.verifyToken, driver.delete);
}