const Blog = require('../models/blogs.model.js');


// POST a Blog
exports.create = (req, res) => {
    // console.log(req.body);
    // Create a Blog
    const blog = new Blog({
        title: req.body.title,
        imageurl: req.body.imageurl,
        description: req.body.description,
        content: req.body.content,
        postedby: req.body.postedby,
    });

    // Save a Blog in the MongoDB
    blog.save()
        .then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};


// FETCH all Blogs
exports.findAll = (req, res) => {
    console.log('fine All');
    Blog.find()
        .then(blogs => {
            // console.log(blogs)
            res.send(blogs);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};


// FIND a Blog
exports.findOne = (req, res) => {
    Blog.findById(req.params.blogId)
        .then(blog => {
            if (!blog) {
                return res.status(404).send({
                    message: "Blog not found with id " + req.params.blogId
                });
            }
            res.send(blog);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Blog not found with id " + req.params.blogId
                });
            }
            return res.status(500).send({
                message: "Error retrieving Blog with id " + req.params.blogId
            });
        });
};

// UPDATE a Blog
exports.update = (req, res) => {
    // Find blog and update it
    Blog.findByIdAndUpdate(req.params.blogId, {
            title: req.body.title,
            imageurl: req.body.imageurl,
            description: req.body.description,
            content: req.body.content,
            postedby: req.body.postedby,
            updated: Date.now
        }, { new: true })
        .then(blog => {
            if (!blog) {
                return res.status(404).send({
                    message: "Blog not found with id " + req.params.blogId
                });
            }
            res.send(blog);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Blog not found with id " + req.params.blogId
                });
            }
            return res.status(500).send({
                message: "Error updating blog with id " + req.params.blogId
            });
        });
};

// DELETE a Blog
exports.delete = (req, res) => {
    Blog.findByIdAndRemove(req.params.blogId)
        .then(blog => {
            if (!blog) {
                return res.status(404).send({
                    message: "Blog not found with id " + req.params.blogId
                });
            }
            res.send({ message: "Blog deleted successfully!" });
        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: "Blog not found with id " + req.params.blogId
                });
            }
            return res.status(500).send({
                message: "Could not delete blog with id " + req.params.blogId
            });
        });
};