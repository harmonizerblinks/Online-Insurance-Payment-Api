module.exports = function(app) {

    var gallery = require('../controllers/gallery.controller.js');

    // Create a new Gallery
    app.post('/api/gallery/:type', gallery.create);

    // Retrieve all Gallery
    /**
     * @swagger
     * /api/gallery:
     *  get:
     *    description: Use to request all gallery
     *    responses:
     *      '200':
     *        description: A successful response
     */
    app.get('/api/gallery', gallery.findAll);

    // Retrieve a single Gallery by Id
    /**
     * @swagger
     * /api/gallery/{sliderId}:
     *  get:
     *    description: Use to request slider by Brand  Id
     *    responses:
     *      '200':
     *        description: A successful response
     */
    app.get('/api/gallery/:galleryId', gallery.findOne);

    // Update a Gallery with Id
    app.put('/api/gallery/:galleryId', gallery.update);

    // Delete a Gallery with Id
    app.delete('/api/gallery/:galleryId', gallery.delete);
}