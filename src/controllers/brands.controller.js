const Brand = require('../models/brands.model.js');


// POST a Brand
exports.create = (req, res) => {
    // console.log(req.body);
    // Create a Brand
    const brand = new Brand({
        name: req.body.name,
        imageurl: req.body.imageurl,
        description: req.body.description
    });

    // Save a Brand in the MongoDB
    brand.save()
        .then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};


// FETCH all Brands
exports.findAll = (req, res) => {
    console.log('fine All');
    Brand.find()
        .then(brands => {
            // console.log(brands)
            res.send(brands);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};


// FIND a Brand
exports.findOne = (req, res) => {
    Brand.findById(req.params.brandId)
        .then(brand => {
            if (!brand) {
                return res.status(404).send({
                    message: "Brand not found with id " + req.params.brandId
                });
            }
            res.send(brand);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Brand not found with id " + req.params.brandId
                });
            }
            return res.status(500).send({
                message: "Error retrieving Brand with id " + req.params.brandId
            });
        });
};

// UPDATE a Brand
exports.update = (req, res) => {
    // Find brand and update it
    Brand.findByIdAndUpdate(req.params.brandId, {
            name: req.body.name,
            imageurl: req.body.imageurl,
            description: req.body.description,
            updated: Date.now
        }, { new: true })
        .then(brand => {
            if (!brand) {
                return res.status(404).send({
                    message: "Brand not found with id " + req.params.brandId
                });
            }
            res.send(brand);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Brand not found with id " + req.params.brandId
                });
            }
            return res.status(500).send({
                message: "Error updating brand with id " + req.params.brandId
            });
        });
};

// DELETE a Brand
exports.delete = (req, res) => {
    Brand.findByIdAndRemove(req.params.brandId)
        .then(brand => {
            if (!brand) {
                return res.status(404).send({
                    message: "Brand not found with id " + req.params.brandId
                });
            }
            res.send({ message: "Brand deleted successfully!" });
        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: "Brand not found with id " + req.params.brandId
                });
            }
            return res.status(500).send({
                message: "Could not delete brand with id " + req.params.brandId
            });
        });
};