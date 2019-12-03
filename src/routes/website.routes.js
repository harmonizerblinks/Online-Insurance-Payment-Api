module.exports = function(app) {

    var website = require('../controllers/website.controller.js');

    // Create a new Order
    app.post('/api/website', website.create);

    // Retrieve all Categories and Products
    app.get('/api/website', website.findAll);

    // Retrieve a single Website by Id
    app.get('/api/website/:productid', website.findOne);

    // Update a Website with Id
    app.put('/api/website/:websiteId', website.update);

}