const Blog = require('../models/blog');

const blog_index = (req, res) => {
    Blog.find({ user: req.user._id }).sort({ createdAt: -1 })
        .then(result => {
            res.render('index', { blogs: result, title: 'My Blogs' });
        })
        .catch(err => {
            console.log(err);
        });
};

const blog_details = (req, res) => {
    const id = req.params.id;
    Blog.findById(id)
        .then(result => {
            if (result.user.toString() === req.user._id.toString()) {
                res.render('details', { blog: result, title: 'Blog Details' });
            } else {
                res.status(403).send('Unauthorized access');
            }
        })
        .catch(err => {
            console.log(err);
        });
};

const blog_create_get = (req, res) => {
    res.render('create', { title: 'Create a new blog' });
};

const blog_create_post = (req, res) => {
    const blog = new Blog({
        ...req.body,
        user: req.user._id
    });

    blog.save()
        .then(result => {
            res.redirect('/blogs');
        })
        .catch(err => {
            console.log(err);
        });
};

const blog_delete = (req, res) => {
    const id = req.params.id;

    Blog.findById(id)
        .then(result => {
            if (result.user.toString() === req.user._id.toString()) {
                return Blog.findByIdAndDelete(id);
            } else {
                res.status(403).json({ message: 'Unauthorized to delete this blog' });
            }
        })
        .then(() => {
            res.json({ redirect: '/blogs' });
        })
        .catch(err => {
            console.log(err);
        });
};

module.exports = {
    blog_index,
    blog_details,
    blog_create_get,
    blog_create_post,
    blog_delete,
};
