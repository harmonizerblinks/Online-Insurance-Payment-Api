const Redirect = require('../models/redirect.model.js');


// POST a Terminated
exports.Completed = async(req, res) => {
    // console.log(req.body);
    // Create a Terminated
    const redirect = new Redirect({ country: req.params.country.toLowerCase(), project: req.params.projectid.toLowerCase(), type: 'completed' });

        await redirect.save()
        .then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};

// POST a Terminated
exports.Partial = async(req, res) => {
    // console.log(req.body);
    // Create a Redirect
    const redirect = new Redirect({ country: req.params.country.toLowerCase(), project: req.params.projectid.toLowerCase(), type: 'partial' });

        await redirect.save()
        .then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};

// POST a Terminated
exports.Terminated = async(req, res) => {
    // console.log(req.body);
    // Create a Redirect
    const redirect = new Redirect({ country: req.params.country.toLowerCase(),  project: req.params.projectid.toLowerCase(), type: 'terminated' });

        await redirect.save()
        .then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};

// FETCH all Redirects
exports.findAll = (req, res) => {
    console.log('fine All');
    Redirect.find()
        .then(redirects => {
            // console.log(redirects)
            res.send(redirects);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};

// FETCH all Redirects With Redirecttype
exports.findAllByType = (req, res) => {
    console.log('fine All by type');
    const query = { type: req.params.type };
    Redirect.find(query)
        .then(redirects => {
            // console.log(redirects)
            res.send(redirects);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};

// FETCH all Redirects With Redirecttype
exports.findAllByCountry = (req, res) => {
    console.log('fine All by country');
    const query = { country: req.params.country };
    Redirect.find(query)
        .then(redirects => {
            // console.log(redirects)
            res.send(redirects);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};

// FETCH all Redirects With Redirecttype
exports.findAllByCountryType = (req, res) => {
    console.log('fine All by country');
    const query = { country: req.params.country, type: req.params.type };
    Redirect.find(query)
        .then(redirects => {
            // console.log(redirects)
            res.send(redirects);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};


// FIND a Redirect
exports.findOne = (req, res) => {
    Redirect.findById(req.params.redirectId)
        .then(redirect => {
            if (!redirect) {
                return res.status(404).send({
                    message: "Redirect not found with id " + req.params.redirectId
                });
            }
            res.send(redirect);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Redirect not found with id " + req.params.redirectId
                });
            }
            return res.status(500).send({
                message: "Error retrieving Redirect with id " + req.params.redirectId
            });
        });
};

// UPDATE a Redirect
exports.update = (req, res) => {
    var redirect = req.body;
    redirect.updated = Date.now;
    // Find redirect and update it
    console.log(req.body)
    Redirect.findByIdAndUpdate(req.params.redirectId, redirect, { new: true })
        .then(redirect => {
            if (!redirect) {
                return res.status(404).send({
                    message: "Redirect not found with id " + req.params.redirectId
                });
            }
            res.send(redirect);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Redirect not found with id " + req.params.redirectId
                });
            }
            console.log(err);
            return res.status(500).send({
                message: "Error updating redirect with id " + req.params.redirectId
            });
        });
};

// DELETE a Redirect
exports.delete = (req, res) => {
    Redirect.findByIdAndRemove(req.params.redirectId)
        .then(redirect => {
            if (!redirect) {
                return res.status(404).send({
                    message: "Redirect not found with id " + req.params.redirectId
                });
            }
            res.send({ message: "Redirect deleted successfully!" });
        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: "Redirect not found with id " + req.params.redirectId
                });
            }
            return res.status(500).send({
                message: "Could not delete redirect with id " + req.params.redirectId
            });
        });
};