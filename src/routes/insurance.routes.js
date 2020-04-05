module.exports = function(app) {

    var insurance = require('../controllers/insurance.controller.js');
    const verify = require('../middleware/verifyJwtToken.middleware.js');
    // console.log('insurance');

    // Create a new Insurance
    app.post('/api/insurees', verify.verifyToken, insurance.create);

    // Retrieve all Insurance
    app.get('/api/insurees', verify.verifyToken, insurance.findAll);

    // Retrieve a single Insurance by Id
    app.get('/api/insurees/:insuranceId', verify.verifyToken, insurance.findOne);

    // Update a Insurance with Id
    app.put('/api/insurees/:insuranceId', verify.verifyToken, insurance.update);

    // Delete a Insurance with Id
    app.delete('/api/insurees/:insuranceId', verify.verifyToken, insurance.delete);
}