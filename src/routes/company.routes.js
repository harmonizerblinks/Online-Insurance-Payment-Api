module.exports = function(app) {

    var company = require('../controllers/company.controller.js');
    const verify = require('../middleware/verifyJwtToken.middleware.js');
    // console.log('company');

    // Create a new Country
    app.post('/api/company', verify.verifyToken, company.create);

    // Retrieve all Country
    app.get('/api/company', verify.verifyToken, company.findAll);

    // Retrieve a single Country by Id
    app.get('/api/company/:companyId', verify.verifyToken, company.findOne);

    // Update a Country with Id
    app.put('/api/company/:companyId', verify.verifyToken, company.update);

    // Delete a Country with Id
    app.delete('/api/company/:companyId', verify.verifyToken, company.delete);
}