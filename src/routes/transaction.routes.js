module.exports = function(app) {

    var transaction = require('../controllers/transaction.controller.js');
    const verify = require('../middleware/verifyJwtToken.middleware.js');
    // console.log('transaction');

    // Create a new Transaction
    app.post('/api/transactions', transaction.create);

    // Retrieve all Transaction
    app.get('/api/transactions', transaction.findAll);

    // Retrieve a single Transaction by Id
    app.get('/api/transactions/:transactionId', transaction.findOne);

    // Update a Transaction with Id
    app.put('/api/transactions/:transactionId', transaction.update);

    // Delete a Transaction with Id
    app.delete('/api/transactions/:transactionId', transaction.delete);
}