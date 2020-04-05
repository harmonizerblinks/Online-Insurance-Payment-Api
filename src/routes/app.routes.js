module.exports = function(app) {

    var apps = require('../controllers/app.controller.js');
    const verify = require('../middleware/verifyJwtToken.middleware.js');

    // Register 
    app.post('/api/register', apps.createUser);

    // Get All Packages 
    app.get('/app/packages', apps.findAllPackages);

    // Get Package By Id 
    app.get('/app/package/:packageId', apps.findOnePackage);

    // Submit Form 
    app.post('/app/insurance', apps.createInsurance);

    // Get All Packages 
    app.post('/app/payment', apps.Makepayment);

    // Get Schedules by Id
    app.get('/app/insurance/:insuranceId', apps.findOneInsurance);

}