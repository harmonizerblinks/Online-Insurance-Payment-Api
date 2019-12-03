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
        .then(async(categorys) => {
            await categorys.forEach(async(cat) => {
                console.log(cat);
                let query = { categoryid: cat._id };
                cat.products = await Product.find(query);
                categories.push(cat);
            });
            res.send(categories);
            // await this.findAllProducts(categorys).then((data) => {
            //     console.log(data);
            //     res.send(data);
            // });
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};

// FETCH all Products
exports.findAlls = async(categorys) => {
    const categories = [];
    await categorys.forEach(async(cat) => {
        console.log(cat);
        let query = { categoryid: cat._id };
        await Product.find(query, (err, products) => {
            // if (err) return [];
            console.log(products)
            cat.products = products;
            categories.push(cat);
        })
    });
    //console.log(categories)
    return await categories;
};

// FETCH all Category
exports.findAllCategorys = (req, res) => {
    Product.find()
        .then(products => {
            res.send(products);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};

// FETCH all Products
exports.findAllProducts = (req, res) => {
    Product.find()
        .then(products => {
            res.send(products);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};

// FETCH all Products by CategoryId
exports.findAllProductsByCategory = (req, res) => {
    let query = { categoryid: req.params.categoryId };
    Product.find(query)
        .then(products => {
            res.send(products);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
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