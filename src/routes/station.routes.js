module.exports = function(app) {

    var saving = require('../controllers/saving.controller.js');
    const verify = require('../middleware/verifyJwtToken.middleware.js');
    // console.log('saving');

    // Create a new Saving
    app.post('/api/savings', saving.create);

    // Retrieve all Saving
    app.get('/api/savings', saving.findAll);

    // Retrieve a single Saving by Id
    app.get('/api/savings/:savingId', saving.findOne);

    // Update a Saving with Id
    app.put('/api/savings/:savingId', saving.update);

    // Delete a Saving with Id
    app.delete('/api/savings/:savingId', saving.delete);
}