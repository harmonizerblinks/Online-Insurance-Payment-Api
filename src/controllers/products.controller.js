const Product = require('../models/products.model.js');


// POST a Product
exports.create = (req, res) => {
    // Create a Product
    const product = new Product({
        code: req.body.code,
        name: req.body.name,
        imageurl: req.body.imageurl,
        images: req.body.images,
        categoryid: req.body.categoryid,
        category: req.body.category,
        introduction: req.body.introduction,
        description: req.body.description,
        amount: req.body.amount,
        sizes: req.body.sizes,
        colors: req.body.colors,
        status: req.body.status,
        discount: req.body.discount,
        percentage: req.body.percentage,
        quantity: req.body.quantity,
        userid: req.body.userid
    });

    // Save a Product in the MongoDB
    product.save()
        .then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};


// FETCH all Products
exports.findAll = (req, res) => {
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
exports.findAllByCategory = (req, res) => {
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


// FIND a Product
exports.findOne = (req, res) => {
    Product.findById(req.params.productId)
        .then(product => {
            if (!product) {
                return res.status(404).send({
                    message: "Product not found with id " + req.params.productId
                });
            }
            res.send(product);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Product not found with id " + req.params.productId
                });
            }
            return res.status(500).send({
                message: "Error retrieving Product with id " + req.params.productId
            });
        });
};

// UPDATE a Product
exports.update = (req, res) => {
    // Find product and update it
    Product.findByIdAndUpdate(req.params.productId, {
            code: req.body.code,
            name: req.body.name,
            imageurl: req.body.imageurl,
            images: req.body.images,
            categoryid: req.body.categoryid,
            category: req.body.category,
            introduction: req.body.introduction,
            description: req.body.description,
            amount: req.body.amount,
            sizes: req.body.sizes,
            colors: req.body.colors,
            status: req.body.status,
            discount: req.body.discount,
            percentage: req.body.percentage,
            quantity: req.body.quantity,
            userid: req.body.userid,
            updated: Date.now
        }, { new: true })
        .then(product => {
            if (!product) {
                return res.status(404).send({
                    message: "Product not found with id " + req.params.productId
                });
            }
            res.send(product);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Product not found with id " + req.params.productId
                });
            }
            return res.status(500).send({
                message: "Error updating product with id " + req.params.productId
            });
        });
};

// DELETE a Product
exports.delete = (req, res) => {
    Product.findByIdAndRemove(req.params.productId)
        .then(product => {
            if (!product) {
                return res.status(404).send({
                    message: "Product not found with id " + req.params.productId
                });
            }
            res.send({ message: "Product deleted successfully!" });
        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: "Product not found with id " + req.params.productId
                });
            }
            return res.status(500).send({
                message: "Could not delete product with id " + req.params.productId
            });
        });
};