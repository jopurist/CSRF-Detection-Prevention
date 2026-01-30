// api/actions_api.js
const express = require('express');
const router = express.Router();
const csrfMiddleware = require('../middleware/csrf_middleware');
const { getSession } = require('../server/session_storage');

// Add item to cart
router.post('/add_item', csrfMiddleware, (req, res) => {
    const session_id = req.cookies.session_id;
    const { item } = req.body;
    const sessionData = getSession(session_id);
    sessionData.items.push(item);
    res.json({ message: `Added ${item} to cart.` });
});

// Remove item from cart
router.post('/remove_item', csrfMiddleware, (req, res) => {
    const session_id = req.cookies.session_id;
    const { index } = req.body;
    const sessionData = getSession(session_id);

    if (sessionData.items[index]) {
        const removed = sessionData.items.splice(index, 1);
        res.json({ message: `Removed ${removed[0]} from cart.` });
    } else {
        res.status(400).json({ message: 'Invalid item index.' });
    }
});

// Update the get_cart route to also return the address
router.get('/get_cart', csrfMiddleware, (req, res) => {
    const session_id = req.cookies.session_id;
    const sessionData = getSession(session_id);
    // Return both items and address
    res.json({ 
        items: sessionData.items,
        address: sessionData.address // Return the address too
    });
});


// Confirm payment
router.post('/confirm_payment', csrfMiddleware, (req, res) => {
    res.json({ message: 'Payment confirmed! Your order is placed.' });
});

// Add address
router.post('/submit_address', csrfMiddleware, (req, res) => {
    const session_id = req.cookies.session_id;
    const { address } = req.body;
    const sessionData = getSession(session_id);
    sessionData.address = address;
    res.json({ message: 'Address saved successfully!' });
});

module.exports = router;
