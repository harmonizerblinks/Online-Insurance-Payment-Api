const Package = require('../models/package.model.js');


// POST a Package
exports.create = (req, res) => {
    // Create a Package
    const package = new Package(req.body);

    // Save a Package in the MongoDB
    package.save()
        .then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};


// FETCH all Packages
exports.findAll = (req, res) => {
    console.log('fine All');
    Package.find()
        .then(package => {
            // console.log(package)
            res.send(package);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};

// FIND a Package
exports.findOne = (req, res) => {
    Package.findById(req.params.packageId)
        .then(package => {
            if (!package) {
                return res.status(404).send({
                    message: "Package not found with id " + req.params.packageId
                });
            }
            res.send(package);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Package not found with id " + req.params.packageId
                });
            }
            return res.status(500).send({
                message: "Error retrieving Package with id " + req.params.packageId
            });
        });
};

// UPDATE a Package
exports.update = (req, res) => {
    var body = req.body;
    // console.log(body)
    body.updated = new Date();
    // Find package and update it
    Package.findByIdAndUpdate(req.params.packageId, body, { new: true })
        .then(package => {
            if (!package) {
                return res.status(404).send({
                    message: "Package not found with id " + req.params.packageId
                });
            }
            res.send(package);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Package not found with id " + req.params.packageId
                });
            }
            return res.status(500).send({
                message: "Error updating package with id " + req.params.packageId
            });
        });
};

// DELETE a Package
exports.delete = (req, res) => {
    Package.findByIdAndRemove(req.params.packageId)
        .then(package => {
            if (!package) {
                return res.status(404).send({
                    message: "Package not found with id " + req.params.packageId
                });
            }
            res.send({ message: "Package deleted successfully!" });
        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: "Package not found with id " + req.params.packageId
                });
            }
            return res.status(500).send({
                message: "Could not delete package with id " + req.params.packageId
            });
        });
};


async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}