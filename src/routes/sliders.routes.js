module.exports = function(app) {

    var sliders = require('../controllers/sliders.controller.js');

    // Create a new Customer
    app.post('/api/sliders', sliders.create);

    // Retrieve all Customer
    /**
     * @swagger
     * /api/sliders:
     *  get:
     *    description: Use to request all sliders
     *    responses:
     *      '200':
     *        description: A successful response
     */
    app.get('/api/sliders', sliders.findAll);

    // Retrieve a single Customer by Id
    /**
     * @swagger
     * /api/sliders/{sliderId}:
     *  get:
     *    description: Use to request slider by Brand  Id
     *    responses:
     *      '200':
     *        description: A successful response
     */
    app.get('/api/sliders/:slidersId', sliders.findOne);

    // Update a Customer with Id
    app.put('/api/sliders/:slidersId', sliders.update);

    // Delete a Customer with Id
    app.delete('/api/sliders/:slidersId', sliders.delete);
}