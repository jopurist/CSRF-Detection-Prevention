const express = require('express');
const router = express.Router();
const { getSession } = require('../server/session_storage');

// Endpoint to get CSRF token
router.get('/get_csrf_token', (req, res) => {
    const session_id = req.cookies.session_id;
    const sessionData = getSession(session_id);

    if (!sessionData) {
        return res.status(403).json({ message: 'Invalid or expired session' });
    }

    // Return the token to the frontend so it can use it in requests
    res.json({ csrf_token: sessionData.csrf_token });
});

module.exports = router;
