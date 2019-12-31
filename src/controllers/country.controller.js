const Country = require('../models/country.model.js');


// POST a Country
exports.create = (req, res) => {
    // Create a Country
    const country = new Country(req.body);

    // Save a Country in the MongoDB
    country.save()
        .then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};


// FETCH all Countrys
exports.findAll = (req, res) => {
    console.log('fine All');
    Country.find()
        .then(country => {
            // console.log(country)
            res.send(country);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};

// FIND a Country
exports.findOne = (req, res) => {
    Country.findById(req.params.countryId)
        .then(country => {
            if (!country) {
                return res.status(404).send({
                    message: "Country not found with id " + req.params.countryId
                });
            }
            res.send(country);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Country not found with id " + req.params.countryId
                });
            }
            return res.status(500).send({
                message: "Error retrieving Country with id " + req.params.countryId
            });
        });
};

// UPDATE a Country
exports.update = (req, res) => {
    var body = req.body;
    // console.log(body)
    body.updated = new Date();
    // Find country and update it
    Country.findByIdAndUpdate(req.params.countryId, body, { new: true })
        .then(country => {
            if (!country) {
                return res.status(404).send({
                    message: "Country not found with id " + req.params.countryId
                });
            }
            res.send(country);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Country not found with id " + req.params.countryId
                });
            }
            return res.status(500).send({
                message: "Error updating country with id " + req.params.countryId
            });
        });
};

// DELETE a Country
exports.delete = (req, res) => {
    Country.findByIdAndRemove(req.params.countryId)
        .then(country => {
            if (!country) {
                return res.status(404).send({
                    message: "Country not found with id " + req.params.countryId
                });
            }
            res.send({ message: "Country deleted successfully!" });
        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: "Country not found with id " + req.params.countryId
                });
            }
            return res.status(500).send({
                message: "Could not delete country with id " + req.params.countryId
            });
        });
};


async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}