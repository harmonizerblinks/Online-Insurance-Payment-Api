module.exports = function(app) {

    var transaction = require('../controllers/transaction.controller.js');
    const verify = require('../middleware/verifyJwtToken.middleware.js');
    // console.log('transaction');

    // Create a new Transaction
    app.post('/api/transactions', verify.verifyToken, transaction.create);

    // Retrieve all Transaction
    app.get('/api/transactions', verify.verifyToken, transaction.findAll);

    // Retrieve a single Transaction by Id
    app.get('/api/transactions/:transactionId', verify.verifyToken, transaction.findOne);

    // Update a Transaction with Id
    app.put('/api/transactions/:transactionId', verify.verifyToken, transaction.update);

    // Delete a Transaction with Id
    app.delete('/api/transactions/:transactionId', verify.verifyToken, transaction.delete);
}