module.exports = function(app) {

    var brands = require('../controllers/brands.controller.js');

    // Create a new Customer
    app.post('/api/brands', brands.create);

    // Retrieve all Customer
    /**
     * @swagger
     * /api/brands:
     *  get:
     *    description: Use to request all brands
     *    responses:
     *      '200':
     *        description: A successful response
     */
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
    app.get('/api/brands/:brandsId', brands.findOne);

    // Update a Customer with Id
    app.put('/api/brands/:brandsId', brands.update);

    // Delete a Customer with Id
    app.delete('/api/brands/:brandsId', brands.delete);
}