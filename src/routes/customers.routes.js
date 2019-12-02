module.exports = function(app) {

    var customers = require('../controllers/customers.controller.js');

    // Create a new Customer
    app.post('/api/customers', customers.create);

    // customer Self registerations
    app.post('/api/customers/register', customers.create);

    // Retrieve all Customer
    /**
     * @swagger
     * /api/customers:
     *  get:
     *    description: Use to request all customers
     *    responses:
     *      '200':
     *        description: A successful response
     */
    app.get('/api/customers', customers.findAll);

    // Retrieve a single Customer by Id
    app.get('/api/customers/:customerId', customers.findOne);

    // Update a Customer with Id
    app.put('/api/customers/:customerId', customers.update);

    // Delete a Customer with Id
    app.delete('/api/customers/:customerId', customers.delete);
}