module.exports = function(app) {

    var submissions = require('../controllers/submissions.controller.js');
    console.log('submission');

    // Create a new Customer
    app.post('/api/submissions', submissions.create);

    // Retrieve all Customer
    app.get('/api/submissions', submissions.findAll);

    // Retrieve a single Customer by Id
    app.get('/api/submissions/:submissionId', submissions.findOne);

    // Update a Customer with Id
    app.put('/api/submissions/:submissionId', submissions.update);

    // Delete a Customer with Id
    app.delete('/api/submissions/:submissionId', submissions.delete);
}