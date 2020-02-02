module.exports = function(app) {

    var expense = require('../controllers/expense.controller.js');
    const verify = require('../middleware/verifyJwtToken.middleware.js');
    // console.log('expense');

    // Create a new Country
    app.post('/api/expenses', verify.verifyToken, expense.create);

    // Retrieve all Country
    app.get('/api/expenses', verify.verifyToken, expense.findAll);

    // Retrieve a single Country by Id
    app.get('/api/expenses/:expenseId', verify.verifyToken, expense.findOne);

    // Update a Country with Id
    app.put('/api/expenses/:expenseId', verify.verifyToken, expense.update);

    // Delete a Country with Id
    app.delete('/api/expenses/:expenseId', verify.verifyToken, expense.delete);
}