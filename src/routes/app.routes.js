module.exports = function(app) {

    var apps = require('../controllers/app.controller.js');
    const verify = require('../middleware/verifyJwtToken.middleware.js');

    // Get All Schedules 
    // app.get('/Schedules', apps.findAllSchedules);

    // // Get Schedules by Id
    // app.get('/Schedules/:scheduleId', apps.findOne);

}