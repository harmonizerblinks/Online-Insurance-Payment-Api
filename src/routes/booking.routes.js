module.exports = function(app) {

    var booking = require('../controllers/booking.controller.js');
    const verify = require('../middleware/verifyJwtToken.middleware.js');
    // console.log('booking');

    // Create a new Region
    app.post('/api/bookings', verify.verifyToken, booking.create);

    // Retrieve all Region
    app.get('/api/bookings', booking.findAll);

    // Retrieve a single Region by Id
    app.get('/api/bookings/:bookingId', verify.verifyToken, booking.findOne);

    // Update a Region with Id
    app.put('/api/bookings/:bookingId', verify.verifyToken, booking.update);

    // Delete a Region with Id
    app.delete('/api/bookings/:bookingId', verify.verifyToken, booking.delete);
}