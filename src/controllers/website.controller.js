const Category = require('../models/category.model.js');
const Brands = require('../models/brands.model.js');;
const Product = require('../models/products.model.js');
const Customer = require('../models/customers.model.js');
// var async = require("async");


// POST a Category
exports.create = (req, res) => {
    // console.log(req.body);
    // Create a Category
    const customer = new Customer(req.body);

    // Save a Category in the MongoDB
    customer.save()
        .then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};


// FETCH all Categorys With their Products
exports.findAll = async(req, res) => {
    console.log('fine All');
    await Category.find()
        .then(async(categorys) => {
            const start = async() => {
                const categories = [];
                await asyncForEach(categorys, async(cat) => {
                    let query = { categoryid: cat._id };
                    cat.products = await Product.find(query);
                    categories.push(cat);
                });
                console.log('Done');
                res.send(categories);
            }
            start();
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};


// FETCH all Categorys With their Products
exports.findAllBrandProducts = async(req, res) => {
    console.log('fine All');
    await Category.find()
        .then(async(categorys) => {
            const start = async() => {
                const categories = [];
                await asyncForEach(categorys, async(cat) => {
                    let query = { categoryid: cat._id };
                    cat.products = await Product.find(query);
                    categories.push(cat);
                });
                console.log('Done');
                res.send(categories);
            }
            start();
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};

// FETCH all Brand
exports.findAllBrands = async(req, res) => {
    await Brands.find()
        .then(brands => {
            res.send(brands);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};

// FETCH all Category
exports.findAllCategorys = async(req, res) => {
    await Category.find()
        .then(categorys => {
            res.send(categorys);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};

// FETCH all Products
exports.findAllProducts = async(req, res) => {
    await Product.find()
        .then(products => {
            res.send(products);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};

// FETCH all Products by CategoryId
exports.findAllProductsByCategory = async(req, res) => {
    let query = { categoryid: req.params.categoryId };
    await Product.find(query)
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

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}