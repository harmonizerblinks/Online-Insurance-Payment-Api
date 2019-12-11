module.exports = function(app) {

    var voters = require('../controllers/voters.controller.js');

    // Create a new Customer
    app.post('/api/voters', voters.create);

    // Retrieve all Customer
    /**
     * @swagger
     * /api/voters:
     *  get:
     *    description: Use to request all voters
     *    responses:
     *      '200':
     *        description: A successful response
     */
    app.get('/api/voters', voters.findAll);

    // Retrieve a single Customer by Id
    /**
     * @swagger
     * /api/voters/{voterId}:
     *  get:
     *    description: Use to request voter by Brand  Id
     *    responses:
     *      '200':
     *        description: A successful response
     */
    app.get('/api/voters/:votersId', voters.findOne);

    // Update a Customer with Id
    app.put('/api/voters/:votersId', voters.update);

    // Delete a Customer with Id
    app.delete('/api/voters/:votersId', voters.delete);
}