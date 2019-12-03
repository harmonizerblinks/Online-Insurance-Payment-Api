const Category = require('../models/category.model.js');
const Product = require('../models/products.model.js');
const Customer = require('../models/customers.model.js');
// var async = require("async");


// POST a Category
exports.create = (req, res) => {
    // console.log(req.body);
    // Create a Category
    const category = new Customer({
        name: req.body.name,
        imageurl: req.body.imageurl,
        description: req.body.description
    });

    // Save a Category in the MongoDB
    category.save()
        .then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};


// FETCH all Categorys
exports.findAll = async(req, res) => {
    console.log('fine All');
    const categories = [];
    await Category.find()
        .then((categorys) => {
            this.findAllProducts(categorys).then((data) => {
                res.send(data);
            });
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        }).finally(() => {
            res.send(categories);
        });
};

// FETCH all Products
exports.findAllProducts = async(categorys, callback) => {
    const categories = [];
    await categorys.forEach((cat) => {
        let query = { categoryid: cat._id };
        Product.find(query, (err, products) => {
            if (err) return [];
            console.log(products)
            cat.products = products;
            categories.push(cat);
        })
    });
    console.log(categories)
    return await categories;
};



// FIND a Category
exports.findOne = (req, res) => {
    Category.findById(req.params.categoryId)
        .then(category => {
            if (!category) {
                return res.status(404).send({
                    message: "Category not found with id " + req.params.categoryId
                });
            }
            res.send(category);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Category not found with id " + req.params.categoryId
                });
            }
            return res.status(500).send({
                message: "Error retrieving Category with id " + req.params.categoryId
            });
        });
};

// UPDATE a Category
exports.update = (req, res) => {
    // Find category and update it
    Category.findByIdAndUpdate(req.params.categoryId, {
            name: req.body.name,
            imageurl: req.body.imageurl,
            description: req.body.description,
            updated: Date.now
        }, { new: true })
        .then(category => {
            if (!category) {
                return res.status(404).send({
                    message: "Category not found with id " + req.params.categoryId
                });
            }
            res.send(category);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Category not found with id " + req.params.categoryId
                });
            }
            return res.status(500).send({
                message: "Error updating category with id " + req.params.categoryId
            });
        });
};

// DELETE a Category
exports.delete = (req, res) => {
    Category.findByIdAndRemove(req.params.categoryId)
        .then(category => {
            if (!category) {
                return res.status(404).send({
                    message: "Category not found with id " + req.params.categoryId
                });
            }
            res.send({ message: "Category deleted successfully!" });
        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: "Category not found with id " + req.params.categoryId
                });
            }
            return res.status(500).send({
                message: "Could not delete category with id " + req.params.categoryId
            });
        });
};