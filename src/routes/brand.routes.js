module.exports = function(app) {

    var brand = require('../controllers/brand.controller.js');
    const verify = require('../middleware/verifyJwtToken.middleware.js');
    // console.log('brand');

    // Create a new Brand
    app.post('/api/brands', brand.create);

    // Retrieve all Brand
    app.get('/api/brands', brand.findAll);

    // Retrieve a single Brand by Id
    app.get('/api/brands/:brandId', brand.findOne);

    // Update a Brand with Id
    app.put('/api/brands/:brandId', brand.update);

    // Delete a Brand with Id
    app.delete('/api/brands/:brandId', brand.delete);
}