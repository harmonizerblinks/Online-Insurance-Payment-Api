module.exports = function(app) {

    var category = require('../controllers/category.controller.js');

    // Create a new Customer
    app.post('/api/category', category.create);

    // Retrieve all Customer
    app.get('/api/category', category.findAll);

    // Retrieve a single Customer by Id
    app.get('/api/category/:categoryId', category.findOne);

    // Update a Customer with Id
    app.put('/api/category/:categoryId', category.update);

    // Delete a Customer with Id
    app.delete('/api/category/:categoryId', category.delete);
}