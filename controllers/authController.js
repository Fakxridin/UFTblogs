const User = require("../models/User");
const jwt = require('jsonwebtoken');

// handle errors
const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { email: '', password: '' };

  // incorrect email
  if (err.message === 'incorrect email') {
    errors.email = 'That email is not registered';
  }

  // incorrect password
  if (err.message === 'incorrect password') {
    errors.password = 'That password is incorrect';
  }

  // duplicate email error
  if (err.code === 11000) {
    errors.email = 'That email is already registered';
    return errors;
  }

  // validation errors
  if (err.message.includes('User validation failed')) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  return errors;
}

// create json web token
const maxAge = 3 * 24 * 60 * 60;  // 3 days
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'tonyman', {
    expiresIn: maxAge
  });
};

// controller actions
module.exports.signup_get = (req, res) => {
  res.render('signup');
}

module.exports.login_get = (req, res) => {
  res.render('login');
}

module.exports.signup_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.create({ email, password });
    const token = createToken(user._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ user: user._id });
  } 
  catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
}

module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);  // Assuming you have a custom login method in User model
    const token = createToken(user._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ user: user._id });
  } 
  catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
}

module.exports.logout_get = (req, res) => {
  res.cookie('jwt', '', { maxAge: 1 });  // Expire the JWT by setting a very short maxAge
  res.redirect('/');
}

//resett
// Forgot Password - GET
module.exports.forgotPassword_get = (req, res) => {
  res.render('forgot-password');  // Render the forgot password page
};

// Forgot Password - POST
module.exports.forgotPassword_post = async (req, res) => {
  const { email } = req.body;
  // Logic to generate reset token and send reset email
  // ...
  res.status(200).json({ message: 'Password reset link sent' });
};

// Reset Password - GET
module.exports.resetPassword_get = (req, res) => {
  const { token } = req.params;
  // Logic to verify the token and render reset password page
  // ...
  res.render('reset-password', { token });  // Render reset password page with token
};

// Reset Password - POST
module.exports.resetPassword_post = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  // Logic to reset the password using the token
  // ...
  res.status(200).json({ message: 'Password reset successful' });
};

