module.exports = function(app) {

    var apps = require('../controllers/app.controller.js');
    const verify = require('../middleware/verifyJwtToken.middleware.js');

    // Get All Schedules 
    app.get('/Schedules', apps.findAllSchedules);

    // Get All Schedules 
    app.get('/Schedules/:scheduleId', apps.findOne);

    // Get All Schedules 
    app.post('/Bookings', apps.Booking);

    // Get User Booking
    app.get('/Bookings/:userId', apps.findUserBookingById);

    // Get All Schedules 
    app.get('/Schedules/Driver/:driverId', apps.findDriverSchedules);

    // Get User Booking
    app.get('/Schedules/Bookings/:scheduleId', apps.findScheduleBookingsById);

}