module.exports = function(app) {

    var brands = require('../controllers/brands.controller.js');
    const passport = require('passport');

    // Create a new Customer
    app.post('/api/brands', brands.create);

    // Retrieve all Customer
    app.get('/api/brands', brands.findAll);

    // Retrieve a single Customer by Id
    /**
     * @swagger
     * /api/brands/{brandId}:
     *  get:
     *    description: Use to request brand by Brand  Id
     *    responses:
     *      '200':
     *        description: A successful response
     */
    app.get('/api/brands/:brandId', brands.findOne);

    // 
    app.get('/api/brands/name/:name', brands.findByName);

    // Update a Customer with Id
    app.put('/api/brands/:brandId', brands.update);

    // Delete a Customer with Id
    app.delete('/api/brands/:brandId', brands.delete);
}