const Customer = require('../models/customers.model.js');


// POST a Customer
exports.create = (req, res) => {
    // console.log(req.body);
    // Create a Customer
    const customer = new Customer({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        age: req.body.age,
        email: req.body.email,
        mobile: req.body.mobile,
        gender: req.body.mobile
    });

    // Save a Customer in the MongoDB
    customer.save()
        .then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};


// FETCH all Customers
exports.findAll = (req, res) => {
    console.log('fine All');
    Customer.find()
        .then(customers => {
            // console.log(customers)
            res.send(customers);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};


// FIND a Customer
exports.findOne = (req, res) => {
    Customer.findById(req.params.customerId)
        .then(customer => {
            if (!customer) {
                return res.status(404).send({
                    message: "Customer not found with id " + req.params.customerId
                });
            }
            res.send(customer);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Customer not found with id " + req.params.customerId
                });
            }
            return res.status(500).send({
                message: "Error retrieving Customer with id " + req.params.customerId
            });
        });
};

// UPDATE a Customer
exports.update = (req, res) => {
    // Find customer and update it
    Customer.findByIdAndUpdate(req.params.customerId, {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            age: req.body.age,
            email: req.body.email,
            mobile: req.body.mobile,
            gender: req.body.mobile,
            updated: Date.now
        }, { new: true })
        .then(customer => {
            if (!customer) {
                return res.status(404).send({
                    message: "Customer not found with id " + req.params.customerId
                });
            }
            res.send(customer);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Customer not found with id " + req.params.customerId
                });
            }
            return res.status(500).send({
                message: "Error updating customer with id " + req.params.customerId
            });
        });
};

// DELETE a Customer
exports.delete = (req, res) => {
    Customer.findByIdAndRemove(req.params.customerId)
        .then(customer => {
            if (!customer) {
                return res.status(404).send({
                    message: "Customer not found with id " + req.params.customerId
                });
            }
            res.send({ message: "Customer deleted successfully!" });
        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: "Customer not found with id " + req.params.customerId
                });
            }
            return res.status(500).send({
                message: "Could not delete customer with id " + req.params.customerId
            });
        });
};