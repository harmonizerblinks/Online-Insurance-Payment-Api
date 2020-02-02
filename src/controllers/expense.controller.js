const Expense = require('../models/expense.model.js');


// POST a Expense
exports.create = (req, res) => {
    // Create a Expense
    const expense = new Expense(req.body);

    // Save a Expense in the MongoDB
    expense.save()
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
    Expense.find()
        .then(expense => {
            // console.log(expense)
            res.send(expense);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};

// FIND a Expense
exports.findOne = (req, res) => {
    Expense.findById(req.params.expenseId)
        .then(expense => {
            if (!expense) {
                return res.status(404).send({
                    message: "Expense not found with id " + req.params.expenseId
                });
            }
            res.send(expense);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Expense not found with id " + req.params.expenseId
                });
            }
            return res.status(500).send({
                message: "Error retrieving Expense with id " + req.params.expenseId
            });
        });
};

// UPDATE a Expense
exports.update = (req, res) => {
    var body = req.body;
    // console.log(body)
    body.updated = new Date();
    // Find expense and update it
    Expense.findByIdAndUpdate(req.params.expenseId, body, { new: true })
        .then(expense => {
            if (!expense) {
                return res.status(404).send({
                    message: "Expense not found with id " + req.params.expenseId
                });
            }
            res.send(expense);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Expense not found with id " + req.params.expenseId
                });
            }
            return res.status(500).send({
                message: "Error updating expense with id " + req.params.expenseId
            });
        });
};

// DELETE a Expense
exports.delete = (req, res) => {
    Expense.findByIdAndRemove(req.params.expenseId)
        .then(expense => {
            if (!expense) {
                return res.status(404).send({
                    message: "Expense not found with id " + req.params.expenseId
                });
            }
            res.send({ message: "Expense deleted successfully!" });
        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: "Expense not found with id " + req.params.expenseId
                });
            }
            return res.status(500).send({
                message: "Could not delete expense with id " + req.params.expenseId
            });
        });
};


async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}