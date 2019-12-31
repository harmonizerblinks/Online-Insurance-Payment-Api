module.exports = function(app) {

    var tour = require('../controllers/tour.controller.js');
    const verify = require('../middleware/verifyJwtToken.middleware.js');
    // console.log('tour');

    // Create a new Tour
    app.post('/api/tours', tour.create);

    // Retrieve all Tour
    app.get('/api/tours', tour.findAll);

    // Retrieve a single Tour by Id
    app.get('/api/tours/:tourId', tour.findOne);

    // Update a Tour with Id
    app.put('/api/tours/:tourId', tour.update);

    // Delete a Tour with Id
    app.delete('/api/tours/:tourId', tour.delete);
}