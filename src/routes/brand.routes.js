module.exports = function(app) {

    var brand = require('../controllers/brand.controller.js');
    const verify = require('../middleware/verifyJwtToken.middleware.js');
    // console.log('brand');

    // Create a new Brand
    app.post('/api/brands', verify.verifyToken, brand.create);

    // Retrieve all Brand
    app.get('/api/brands', verify.verifyToken, brand.findAll);

    // Retrieve a single Brand by Id
    app.get('/api/brands/:brandId', verify.verifyToken, brand.findOne);

    // Update a Brand with Id
    app.put('/api/brands/:brandId', verify.verifyToken, brand.update);

    // Delete a Brand with Id
    app.delete('/api/brands/:brandId', verify.verifyToken, brand.delete);
}