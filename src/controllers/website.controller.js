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
        .then(async(brands) => {
            const start = async() => {
                const categories = [];
                await asyncForEach(brands, async(brand) => {
                    let query = { brandid: cat._id };
                    brand.products = await Product.find(query);
                    // brand.produ.push(cat);
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


// FIND a Brand by name
exports.findByName = (req, res) => {
    let query = { name: req.params.name };
    Brand.findOne(query)
        .then(brand => {
            if (!brand) {
                return res.status(404).send({
                    message: "Brand not found with Name " + req.params.name
                });
            }
            const start = async() => {
                const categories = [];
                await asyncForEach(brand.categoryid, async(c) => {
                    const category = await Category.findById(c);
                    categories.push(category);
                });
                // console.log('Done');
                brand.categorys = categories;
                res.send(brand);
            }
            start();
            // res.send(brand);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Brand not found with name " + req.params.name
                });
            }
            return res.status(500).send({
                message: "Error retrieving Brand with name " + req.params.name
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

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}