const Company = require('../models/company.model.js');


// POST a Company
exports.create = (req, res) => {
    // Create a Company
    const company = new Company(req.body);

    // Save a Company in the MongoDB
    company.save()
        .then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};


// FETCH all Companys
exports.findAll = (req, res) => {
    console.log('fine All');
    Company.find()
        .then(company => {
            // console.log(company)
            res.send(company);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};

// FIND a Company
exports.findOne = (req, res) => {
    Company.findById(req.params.companyId)
        .then(company => {
            if (!company) {
                return res.status(404).send({
                    message: "Company not found with id " + req.params.companyId
                });
            }
            res.send(company);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Company not found with id " + req.params.companyId
                });
            }
            return res.status(500).send({
                message: "Error retrieving Company with id " + req.params.companyId
            });
        });
};

// UPDATE a Company
exports.update = (req, res) => {
    var body = req.body;
    // console.log(body)
    body.updated = new Date();
    // Find company and update it
    Company.findByIdAndUpdate(req.params.companyId, body, { new: true })
        .then(company => {
            if (!company) {
                return res.status(404).send({
                    message: "Company not found with id " + req.params.companyId
                });
            }
            res.send(company);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Company not found with id " + req.params.companyId
                });
            }
            return res.status(500).send({
                message: "Error updating company with id " + req.params.companyId
            });
        });
};

// DELETE a Company
exports.delete = (req, res) => {
    Company.findByIdAndRemove(req.params.companyId)
        .then(company => {
            if (!company) {
                return res.status(404).send({
                    message: "Company not found with id " + req.params.companyId
                });
            }
            res.send({ message: "Company deleted successfully!" });
        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: "Company not found with id " + req.params.companyId
                });
            }
            return res.status(500).send({
                message: "Could not delete company with id " + req.params.companyId
            });
        });
};


async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}