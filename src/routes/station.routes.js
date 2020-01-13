module.exports = function(app) {

    var station = require('../controllers/station.controller.js');
    const verify = require('../middleware/verifyJwtToken.middleware.js');
    // console.log('station');

    // Create a new Stations
    app.post('/api/stations', station.create);

    // Retrieve all Stations
    app.get('/api/stations', station.findAll);

    // Retrieve a single Stations by Id
    app.get('/api/stations/:stationId', station.findOne);

    // Update a Stations with Id
    app.put('/api/stations/:stationId', station.update);

    // Delete a Stations with Id
    app.delete('/api/stations/:stationId', station.delete);
}