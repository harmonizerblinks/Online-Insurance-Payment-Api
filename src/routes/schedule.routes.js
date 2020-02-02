module.exports = function(app) {

    var schedule = require('../controllers/schedule.controller.js');
    const verify = require('../middleware/verifyJwtToken.middleware.js');
    // console.log('schedule');

    // Create a new Schedule
    app.post('/api/schedules', verify.verifyToken, schedule.create);

    // Retrieve all Schedule
    app.get('/api/schedules', verify.verifyToken, schedule.findAll);

    // Retrieve a single Schedule by Id
    app.get('/api/schedules/:scheduleId', verify.verifyToken, schedule.findOne);

    // Update a Schedule with Id
    app.put('/api/schedules/:scheduleId', verify.verifyToken, schedule.update);

    // Delete a Schedule with Id
    app.delete('/api/schedules/:scheduleId', verify.verifyToken, schedule.delete);
}