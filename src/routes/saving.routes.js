module.exports = function(app) {

    var saving = require('../controllers/saving.controller.js');
    const verify = require('../middleware/verifyJwtToken.middleware.js');
    // console.log('saving');

    // Create a new Region
    app.post('/api/savings', saving.create);

    // Retrieve all Region
    app.get('/api/savings', saving.findAll);

    // Retrieve a single Region by Id
    app.get('/api/savings/:savingId', saving.findOne);

    // Update a Region with Id
    app.put('/api/savings/:savingId', saving.update);

    // Delete a Region with Id
    app.delete('/api/savings/:savingId', saving.delete);
}