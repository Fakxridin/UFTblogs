const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const { requireAuth } = require('../middleware/authMiddleware');

// Public routes (if any)
router.get('/', blogController.blog_index);  // Shows all blogs for the logged-in user

// Protected routes (require authentication)
router.use(requireAuth);  // Apply `requireAuth` for all routes below this line

router.get('/create', blogController.blog_create_get);  // Show create blog form
router.post('/', blogController.blog_create_post);  // Create a new blog
router.get('/:id', blogController.blog_details);  // Show blog details
router.delete('/:id', blogController.blog_delete);  // Delete a blog

module.exports = router;
