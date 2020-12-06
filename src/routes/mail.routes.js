module.exports = function(app) {

    var mail = require('../controllers/mail.controller.js');
    const verify = require('../middleware/verifyJwtToken.middleware.js');
    // console.log('mail');

    // Create a new Insurance
    app.post('/api/mail', verify.verifyToken, mail.create);

    app.post('/api/contact', mail.create);
    // Retrieve all Insurance
    app.get('/api/mail', verify.verifyToken, mail.findAll);

    // Retrieve a single Insurance by Id
    app.get('/api/mail/:mailId', verify.verifyToken, mail.findOne);

    // Update a Insurance with Id
    app.put('/api/mail/:mailId', verify.verifyToken, mail.update);

    // Delete a Insurance with Id
    app.delete('/api/mail/:mailId', verify.verifyToken, mail.delete);
}