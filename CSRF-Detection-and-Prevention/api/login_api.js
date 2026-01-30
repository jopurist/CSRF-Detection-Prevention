const express = require('express');
const router = express.Router();
const { createSession, getSession } = require('../server/session_storage');
const crypto = require('crypto');

router.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (username === 'user1' && password === '1user') {
        const sessionId = Math.random().toString(36).substring(2);

        // Generate CSRF token
        const csrfToken = crypto.randomBytes(16).toString('hex');

        createSession(sessionId, {
            username,
            items: [],
            address: null,
            csrf_token: csrfToken
        });

        console.log("CSRF Token for session", sessionId, ":", csrfToken);

        res.cookie('session_id', sessionId, {
            httpOnly: true,
            sameSite: 'None',
            secure: true,
            maxAge: 30 * 60 * 1000
        });
        res.cookie('page_sequence', 'login', {
            httpOnly: true,
            sameSite: 'None',
            secure: true
        });

        res.json({ message: 'Login successful', redirect: '/home' });
    } else {
        res.status(401).json({ message: 'Invalid username or password' });
    }
});

module.exports = router;
