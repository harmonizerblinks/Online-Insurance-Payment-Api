module.exports = function(app) {

    var videos = require('../controllers/videos.controller.js');

    // Create a new Customer
    app.post('/api/videos', videos.create);

    // Retrieve all Customer
    app.get('/api/videos', videos.findAll);

    // Retrieve a single Customer by Id
    app.get('/api/videos/:videoId', videos.findOne);

    // Update a Customer with Id
    app.put('/api/videos/:videoId', videos.update);

    // Delete a Customer with Id
    app.delete('/api/videos/:videoId', videos.delete);
}