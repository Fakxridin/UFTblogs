const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to protect routes and verify JWT
const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;

    // Check whether there is a token or not
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET || 'tonyman', async (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                res.redirect('/login');
            } else {
                // Attach the user to the request object for easy access in controllers
                req.user = await User.findById(decodedToken.id);
                next();
            }
        });
    } else {
        res.redirect('/login');
    }
};

// Check the current user and attach to locals for views
const checkUser = (req, res, next) => {
    const token = req.cookies.jwt;

    if (token) {
        jwt.verify(token, process.env.JWT_SECRET || 'tonyman', async (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                res.locals.user = null;
                next();
            } else {
                let user = await User.findById(decodedToken.id);
                res.locals.user = user;
                next();
            }
        });
    } else {
        res.locals.user = null;
        next();
    }
};

module.exports = { requireAuth, checkUser };
