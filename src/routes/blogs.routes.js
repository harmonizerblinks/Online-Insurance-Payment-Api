module.exports = function(app) {

    var blogs = require('../controllers/blogs.controller.js');

    // Create a new Customer
    app.post('/api/blogs', blogs.create);

    // Retrieve all Customer
    app.get('/api/blogs', blogs.findAll);

    // Retrieve a single Customer by Id
    app.get('/api/blogs/:blogsId', blogs.findOne);

    // Update a Customer with Id
    app.put('/api/blogs/:blogsId', blogs.update);

    // Delete a Customer with Id
    app.delete('/api/blogs/:blogsId', blogs.delete);
}