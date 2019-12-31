const Region = require('../models/region.model.js');


// POST a Region
exports.create = (req, res) => {
    // Create a Region
    const region = new Region(req.body);

    // Save a Region in the MongoDB
    region.save()
        .then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};


// FETCH all Regions
exports.findAll = (req, res) => {
    console.log('fine All');
    Region.find()
        .then(regions => {
            // console.log(regions)
            res.send(regions);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};

// FIND a Region
exports.findOne = (req, res) => {
    Region.findById(req.params.regionId)
        .then(region => {
            if (!region) {
                return res.status(404).send({
                    message: "Region not found with id " + req.params.regionId
                });
            }
            res.send(slider);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Region not found with id " + req.params.regionId
                });
            }
            return res.status(500).send({
                message: "Error retrieving Region with id " + req.params.regionId
            });
        });
};

// UPDATE a Region
exports.update = (req, res) => {
    var body = req.body;
    // console.log(body)
    body.updated = new Date();
    // Find region and update it
    Region.findByIdAndUpdate(req.params.regionId, body, { new: true })
        .then(region => {
            if (!region) {
                return res.status(404).send({
                    message: "Region not found with id " + req.params.regionId
                });
            }
            res.send(region);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Region not found with id " + req.params.regionId
                });
            }
            return res.status(500).send({
                message: "Error updating region with id " + req.params.regionId
            });
        });
};

// DELETE a Region
exports.delete = (req, res) => {
    Region.findByIdAndRemove(req.params.regionId)
        .then(region => {
            if (!region) {
                return res.status(404).send({
                    message: "Region not found with id " + req.params.regionId
                });
            }
            res.send({ message: "Region deleted successfully!" });
        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: "Region not found with id " + req.params.regionId
                });
            }
            return res.status(500).send({
                message: "Could not delete region with id " + req.params.regionId
            });
        });
};


async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}