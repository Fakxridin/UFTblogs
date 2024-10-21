//
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser')
const authRoutes = require('./routes/authRoutes')
const blogRoutes = require('./routes/blogRoutes');
const axios = require('axios')
const nodemailer = require('nodemailer')
const crypto = require('crypto');
const { requireAuth, checkUser } = require('./middleware/authMiddleware');
const port = process.env.PORT || 3000;
// express app
const app = express();

// connect to mongodb & listen for requests
const dbURI = "mongodb+srv://tonyuft4002:dasturchi@cluster0.gfehr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(dbURI)
  .then(result => app.listen(port))
  .catch(err => console.log(err));

// register view engine
app.set('view engine', 'ejs');

// middleware & static files
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(cookieParser())

app.use((req, res, next) => {
  res.locals.path = req.path;
  next();
});

// routes
app.get('*', checkUser)
  app.get('/', (req, res) => {
  res.redirect('/blogs');
});

  app.get('/about', (req, res) => {
  res.render('about', { title: 'About' });
});

// blog routes
  app.use('/blogs', requireAuth, blogRoutes)
//auth route
  app.use(authRoutes);
 
 // Function to verify Google ID Token
async function verifyIdToken(token) {
  const response = await axios.get(`https://oauth2.googleapis.com/tokeninfo?id_token=${token}`);
  return response.data; // If valid, will return user info
}


  module.exports = app;
