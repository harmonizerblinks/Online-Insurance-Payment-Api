module.exports = function(app) {

    var country = require('../controllers/country.controller.js');
    const verify = require('../middleware/verifyJwtToken.middleware.js');
    // console.log('country');

    // Create a new Country
    app.post('/api/country', verify.verifyToken, country.create);

    // Retrieve all Country
    app.get('/api/country', verify.verifyToken, country.findAll);

    // Retrieve a single Country by Id
    app.get('/api/country/:countryId', verify.verifyToken, country.findOne);

    // Update a Country with Id
    app.put('/api/country/:countryId', verify.verifyToken, country.update);

    // Delete a Country with Id
    app.delete('/api/country/:countryId', verify.verifyToken, country.delete);
}