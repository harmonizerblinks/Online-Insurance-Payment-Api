module.exports = function(app) {

    var busfee = require('../controllers/busfee.controller.js');
    const verify = require('../middleware/verifyJwtToken.middleware.js');
    // console.log('busfee');

    // Create a new Region
    app.post('/api/busfees', busfee.create);

    // Retrieve all Region
    app.get('/api/busfees', busfee.findAll);

    // Retrieve a single Region by Id
    app.get('/api/busfees/:busfeeId', busfee.findOne);

    // Update a Region with Id
    app.put('/api/busfees/:busfeeId', busfee.update);

    // Delete a Region with Id
    app.delete('/api/busfees/:busfeeId', busfee.delete);
}