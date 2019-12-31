const Location = require('../models/location.model.js');


// POST a Location
exports.create = (req, res) => {
    // Create a Location
    const location = new Location(req.body);

    // Save a Location in the MongoDB
    location.save()
        .then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};


// FETCH all Locations
exports.findAll = (req, res) => {
    console.log('fine All');
    Location.find()
        .then(locations => {
            // console.log(locations)
            res.send(locations);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};

// FIND a Location
exports.findOne = (req, res) => {
    Location.findById(req.params.locationId)
        .then(location => {
            if (!location) {
                return res.status(404).send({
                    message: "Location not found with id " + req.params.locationId
                });
            }
            res.send(slider);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Location not found with id " + req.params.locationId
                });
            }
            return res.status(500).send({
                message: "Error retrieving Location with id " + req.params.locationId
            });
        });
};

// UPDATE a Location
exports.update = (req, res) => {
    var body = req.body;
    // console.log(body)
    body.updated = new Date();
    // Find location and update it
    Location.findByIdAndUpdate(req.params.locationId, body, { new: true })
        .then(location => {
            if (!location) {
                return res.status(404).send({
                    message: "Location not found with id " + req.params.locationId
                });
            }
            res.send(location);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Location not found with id " + req.params.locationId
                });
            }
            return res.status(500).send({
                message: "Error updating location with id " + req.params.locationId
            });
        });
};

// DELETE a Location
exports.delete = (req, res) => {
    Location.findByIdAndRemove(req.params.locationId)
        .then(location => {
            if (!location) {
                return res.status(404).send({
                    message: "Location not found with id " + req.params.locationId
                });
            }
            res.send({ message: "Location deleted successfully!" });
        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: "Location not found with id " + req.params.locationId
                });
            }
            return res.status(500).send({
                message: "Could not delete location with id " + req.params.locationId
            });
        });
};


async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}