const Transaction = require('../models/transaction.model.js');


// POST a Transaction
exports.create = (req, res) => {
    // Create a Transaction
    const transaction = new Transaction(req.body);

    // Save a Transaction in the MongoDB
    transaction.save()
        .then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};


// FETCH all Transactions
exports.findAll = (req, res) => {
    console.log('fine All');
    Transaction.find()
        .then(transactions => {
            // console.log(transactions)
            res.send(transactions);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};

// FIND a Transaction
exports.findOne = (req, res) => {
    Transaction.findById(req.params.transactionId)
        .then(transaction => {
            if (!transaction) {
                return res.status(404).send({
                    message: "Transaction not found with id " + req.params.transactionId
                });
            }
            res.send(slider);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Transaction not found with id " + req.params.transactionId
                });
            }
            return res.status(500).send({
                message: "Error retrieving Transaction with id " + req.params.transactionId
            });
        });
};

// UPDATE a Transaction
exports.update = (req, res) => {
    var body = req.body;
    // console.log(body)
    body.updated = new Date();
    // Find transaction and update it
    Transaction.findByIdAndUpdate(req.params.transactionId, body, { new: true })
        .then(transaction => {
            if (!transaction) {
                return res.status(404).send({
                    message: "Transaction not found with id " + req.params.transactionId
                });
            }
            res.send(transaction);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Transaction not found with id " + req.params.transactionId
                });
            }
            return res.status(500).send({
                message: "Error updating transaction with id " + req.params.transactionId
            });
        });
};

// DELETE a Transaction
exports.delete = (req, res) => {
    Transaction.findByIdAndRemove(req.params.transactionId)
        .then(transaction => {
            if (!transaction) {
                return res.status(404).send({
                    message: "Transaction not found with id " + req.params.transactionId
                });
            }
            res.send({ message: "Transaction deleted successfully!" });
        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: "Transaction not found with id " + req.params.transactionId
                });
            }
            return res.status(500).send({
                message: "Could not delete transaction with id " + req.params.transactionId
            });
        });
};


async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}