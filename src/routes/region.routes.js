module.exports = function(app) {

    var region = require('../controllers/region.controller.js');
    const verify = require('../middleware/verifyJwtToken.middleware.js');
    // console.log('region');

    // Create a new Region
    app.post('/api/regions', region.create);

    // Retrieve all Region
    app.get('/api/regions', region.findAll);

    // Retrieve a single Region by Id
    app.get('/api/regions/:regionId', region.findOne);

    // Update a Region with Id
    app.put('/api/regions/:regionId', region.update);

    // Delete a Region with Id
    app.delete('/api/regions/:regionId', region.delete);
}