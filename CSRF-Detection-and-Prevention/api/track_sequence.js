const express = require('express');
const router = express.Router();
const { getSession } = require('../server/session_storage');

router.post('/track', (req, res) => {
    const { nextPage } = req.body;
    const sessionId = req.cookies.session_id;
    const session = getSession(sessionId);

    if (!session) {
        return res.status(401).json({ message: 'Invalid session' });
    }

    const previousPage = req.cookies.page_sequence;
    const allowedSequences = {
        'login': ['home'],
        'home': ['cart', 'login'],
        'cart': ['home', 'add_address'],
        'add_address': ['cart']
    };

    if (!allowedSequences[previousPage] || !allowedSequences[previousPage].includes(nextPage)) {
        return res.status(403).json({ message: 'Invalid navigation!' });
    }
    
    res.cookie('page_sequence', pageName, { httpOnly: true, sameSite: 'None', secure: true});
    res.json({ message: 'Page sequence updated' });
});

module.exports = router;