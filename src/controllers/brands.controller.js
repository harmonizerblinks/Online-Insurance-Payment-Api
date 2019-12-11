const Brand = require('../models/brands.model.js');
const Category = require('../models/category.model.js');


// POST a Brand
exports.create = (req, res) => {
    // Create a Brand
    const brand = new Brand(req.body);

    // Save a Brand in the MongoDB
    brand.save()
        .then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};


// FETCH all Brands
exports.findAll = (req, res) => {
    console.log('fine All');
    Brand.find()
        .then(brands => {
            // console.log(brands)
            res.send(brands);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};


// FIND a Brand
exports.findOne = (req, res) => {
    Brand.findById(req.params.brandId)
        .then(brand => {
            if (!brand) {
                return res.status(404).send({
                    message: "Brand not found with id " + req.params.brandId
                });
            }
            res.send(brand);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Brand not found with id " + req.params.brandId
                });
            }
            return res.status(500).send({
                message: "Error retrieving Brand with id " + req.params.brandId
            });
        });
};


// FIND a Brand
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

// UPDATE a Brand
exports.update = (req, res) => {
    var body = req.body;
    // console.log(body)
    body.updated = new Date();
    // Find brand and update it
    Brand.findByIdAndUpdate(req.params.brandId, body, { new: true })
        .then(brand => {
            if (!brand) {
                return res.status(404).send({
                    message: "Brand not found with id " + req.params.brandId
                });
            }
            res.send(brand);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Brand not found with id " + req.params.brandId
                });
            }
            return res.status(500).send({
                message: "Error updating brand with id " + req.params.brandId
            });
        });
};

// DELETE a Brand
exports.delete = (req, res) => {
    Brand.findByIdAndRemove(req.params.brandId)
        .then(brand => {
            if (!brand) {
                return res.status(404).send({
                    message: "Brand not found with id " + req.params.brandId
                });
            }
            res.send({ message: "Brand deleted successfully!" });
        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: "Brand not found with id " + req.params.brandId
                });
            }
            return res.status(500).send({
                message: "Could not delete brand with id " + req.params.brandId
            });
        });
};


async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}