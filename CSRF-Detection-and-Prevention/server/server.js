// server/server.js
require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const csrfMiddleware = require('../middleware/csrf_middleware');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// In server.js, before your routes:
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,POST");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
  });
  

// Serve static files
app.use('/static', express.static(path.join(__dirname, '../static')));

// Import routers
const loginApi = require('../api/login_api');
const trackSequenceApi = require('../api/track_sequence');
const validateRequestApi = require('../api/validate_request');
const actionsApi = require('../api/actions_api');
const csrfApi = require('../api/csrf_api'); 


// Use routers
app.use('/api', loginApi);
app.use('/api', trackSequenceApi);
app.use('/api', validateRequestApi);
app.use('/api', actionsApi);
app.use('/api', csrfApi);

// Serve HTML pages
app.get('/', (req, res) => res.sendFile(path.join(__dirname, '../templates/login.html')));
app.get('/home', csrfMiddleware, (req, res) => res.sendFile(path.join(__dirname, '../templates/home.html')));
app.get('/cart', csrfMiddleware, (req, res) => res.sendFile(path.join(__dirname, '../templates/cart.html')));
app.get('/add_address', csrfMiddleware, (req, res) => res.sendFile(path.join(__dirname, '../templates/add_address.html')));

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
