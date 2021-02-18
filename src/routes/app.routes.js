module.exports = function(app) {

    var apps = require('../controllers/app.controller.js');
    var contact = require('../controllers/mail.controller.js');
    var ussd = require('../controllers/ussd.controller.js');
    var usla = require('../controllers/usla.controller.js');
    var vsla = require('../controllers/vsla.controller.js');
    var pension = require('../controllers/pension.controller.js');
    var paynow = require('../controllers/paynow.controller.js');
    var ahantaman = require('../controllers/ahantaman.controller.js');
    const verify = require('../middleware/verifyJwtToken.middleware.js');
    const user = require('../middleware/verifysignup.middleware.js');

    // Register 
    app.post('/api/register', user.checkDuplicateUserNameOrEmail, verify.verifyToken, apps.createUser);

    // App user Login
    // app.post('/api/login', apps.login);

    // Logout
    app.get('/api/logout', verify.verifyToken, apps.logout);

    // Change Password
    app.post('/api/change-password', verify.verifyToken, apps.changePassword);

    // Retrieve user Detail
    app.get('/api/profile', verify.verifyToken, apps.profile);

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


    // Group Save Ussd
    // app.post('/api/ussd', ussd.ussd);
    app.post('/api/ussd', paynow.ussd);

    // Group Save Ussd
    app.post('/api/ussd/usla', usla.ussd);

    // Group Save Ussd
    app.post('/api/ussd/vsla', vsla.ussd);

    // Paynow
    app.post('/api/ussd/pension', paynow.ussd);

    // People Pension Trust
    app.post('/api/ussd/paynow', pension.ussd);

    // Ahantaman Rural Bank Group Saving
    app.post('/api/ussd/ahantaman', ahantaman.ussd);

}