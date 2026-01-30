const express = require('express');
const router = express.Router();
const csrfMiddleware = require('../middleware/csrf_middleware');

// Example endpoint to confirm payment
router.post('/confirm_payment', csrfMiddleware, (req, res) => {
    // If the CSRF middleware passes, this action is allowed
    res.json({ message: 'Payment confirmed!' });
});

module.exports = router;
