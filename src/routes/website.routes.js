module.exports = function(app) {

    var website = require('../controllers/website.controller.js');

    // Create a new Order
    app.post('/api/website', website.create);

    // Retrieve all Categories and Products
    app.get('/api/website', website.findAll);

    // Retrieve all Categories
    app.get('/api/website/category', website.findAllCategorys);

    // Retrieve all Products
    app.get('/api/website/products', website.findAllProducts);

    // Retrieve all Products by CategoryId
    app.get('/api/website/category/:categoryId', website.findAllProductsByCategory);

    // Retrieve a single Website by Id
    app.get('/api/website/:productid', website.findOne);

    // Update a Website with Id
    app.put('/api/website/:websiteId', website.update);

}