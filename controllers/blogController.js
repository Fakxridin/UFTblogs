const Blog = require('../models/blog');

// Get all blogs for the current user
const blog_index = (req, res) => {
    Blog.find({ user: req.user._id }).sort({ createdAt: -1 })
        .then(result => {
            res.render('index', { blogs: result, title: 'My Blogs' });
        })
        .catch(err => {
            console.log(err);
        });
};

// Get blog details for a specific blog
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

// Render the create blog page
const blog_create_get = (req, res) => {
    res.render('create', { title: 'Create a new blog' });
};

// Handle the form submission for creating a new blog
const blog_create_post = (req, res) => {
    // Check if a blog with the same title already exists
    Blog.findOne({ title: req.body.title, user: req.user._id })
        .then(existingBlog => {
            if (existingBlog) {
                return res.status(400).json({ message: 'Blog with this title already exists.' });
            }

            const blog = new Blog({
                ...req.body,
                user: req.user._id // associate the blog with the logged-in user
            });

            return blog.save();
        })
        .then(result => {
            res.redirect('/blogs');
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: 'An error occurred while creating the blog.' });
        });
};

// Render the edit blog page
const blog_edit_get = (req, res) => {
    const id = req.params.id;
    Blog.findById(id)
        .then(result => {
            if (result) {
                // Render edit page with the blog data
                res.render('edit', { blog: result, title: 'Edit Blog', error: null });
            } else {
                res.status(404).render('edit', { blog: {}, title: 'Edit Blog', error: 'Blog not found' }); // Handle not found error
            }
        })
        .catch(err => {
            console.error(err);
            res.status(500).render('edit', { blog: {}, title: 'Edit Blog', error: 'Internal Server Error' }); // Handle error with server
        });
};

// Handle the form submission for updating a blog
const blog_edit_post = (req, res) => {
    const id = req.params.id;
    const { title, snippet, body } = req.body; // Ensure body is destructured and available

    Blog.findById(id) // Fetch the blog to edit
        .then(blog => {
            if (!blog) {
                return res.status(404).send('Blog not found');
            }
            if (blog.user.toString() !== req.user._id.toString()) {
                return res.status(403).send('Unauthorized access');
            }

            // Update properties
            blog.title = title || blog.title; // Update title if provided
            blog.snippet = snippet || blog.snippet; // Update snippet if provided
            blog.body = body || blog.body; // Update body if provided

            return blog.save(); // Save the changes
        })
        .then(() => {
            res.redirect(`/blogs/${id}`); // Redirect to the blog detail view
        })
        .catch(err => {
            console.error(err); // Log any errors
            res.status(500).send('Internal Server Error');
        });
};

// Delete a blog
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
    blog_edit_get,
    blog_edit_post,
    blog_delete,
};