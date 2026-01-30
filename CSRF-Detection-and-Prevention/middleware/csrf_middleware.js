const { MODE } = require('../api/settings');
const { getSession } = require('../server/session_storage');

module.exports = function (req, res, next) {
    const startTime = process.hrtime(); // Start timing
    console.log('---------------------------------------------------------------');
    console.log("MODE Environment Variable:", MODE);
    console.log('CSRF Middleware Debug:');
    console.log('Full Request Path:', req.path);
    console.log('Request Method:', req.method);
    console.log('Cookies:', req.cookies);

    const sessionId = req.cookies.session_id;
    const session = getSession(sessionId);

    // Validate session exists
    if (!session) {
        console.log('Session validation failed');
        logExecutionTime(startTime, 'Session validation failed');
        return res.status(403).json({ message: 'Invalid session' });
    }

    // CSRF Token Validation, Comment this section to skip CSRF Token checks
    if (req.method !== 'GET') {
        const requestToken = req.headers['x-csrf-token'];
        if (!requestToken || requestToken !== session.csrf_token) {
            console.log('CSRF token validation failed');
            logExecutionTime(startTime, 'CSRF token validation failed');
            return res.status(403).json({ message: 'Invalid CSRF token' });
        }
    }

    // Samesite Cookie only mode
    if (MODE === 'COOKIE_ONLY') {
        console.log('Running in COOKIE_ONLY Mode: Skipping CSRF token and navigation checks');
        logExecutionTime(startTime, 'COOKIE_ONLY Mode');
        return next();
    }

    // CSRF Token only mode
    if (MODE === 'CSRF_ONLY') {
        console.log('Running in CSRF_ONLY Mode: Skipping page sequence checks');
        logExecutionTime(startTime, 'CSRF_ONLY Mode');
        return next();
    }

    // FULL Mode: Navigation Sequence Enforcement
    const allowedSequences = {
        'login': ['login', 'home'],
        'home': ['home', 'login', 'cart'],
        'cart': ['cart', 'home', 'add_address'],
        'add_address': ['add_address', 'cart']
    };

    const previousPage = req.cookies.page_sequence || 'login';
    const pathParts = req.path.split('/').filter(part => part !== '');
    const target = pathParts[pathParts.length - 1];

    console.log('Extracted Target:', target);
    console.log('Previous Page:', previousPage);

    const actionToPage = {
        'add_item': 'home',
        'remove_item': 'cart',
        'get_cart': 'cart',
        'confirm_payment': 'cart',
        'submit_address': 'add_address'
    };

    const pageRoutes = ['/home', '/cart', '/add_address', 'home', 'cart', 'add_address'];
    const isPageRequest = pageRoutes.includes(req.path) || pageRoutes.includes(target);
    const isActionRequest = Object.keys(actionToPage).includes(target);

    if (isPageRequest) {
        const pageName = target;
        console.log('Checking Page Transition:', previousPage, '->', pageName);

        if (!allowedSequences[previousPage]?.includes(pageName)) {
            console.log('Invalid Page Transition');
            logExecutionTime(startTime, 'Invalid Page Transition');
            return res.status(403).json({
                message: `Navigation from ${previousPage} to ${pageName} not allowed.`,
            });
        }

        res.cookie('page_sequence', pageName, { httpOnly: true, sameSite: 'None', secure: true });
        logExecutionTime(startTime, 'Page Transition Allowed');
        return next();
    }

    if (isActionRequest) {
        const requiredPage = actionToPage[target];
        console.log('Checking Action Request:', previousPage, '->', target);

        if (requiredPage && previousPage !== requiredPage) {
            console.log('Invalid Action Request');
            logExecutionTime(startTime, 'Invalid Action Request');
            return res.status(403).json({
                message: `Action ${target} not allowed from ${previousPage} page.`,
            });
        }
        logExecutionTime(startTime, 'Action Request Allowed');
        return next();
    }

    console.log('Unhandled Request:', req.path);
    logExecutionTime(startTime, 'Unhandled Request');
    return res.status(403).json({ message: 'Unknown request or invalid sequence.' });
};

// Function to log execution time
function logExecutionTime(startTime, message) {
    const endTime = process.hrtime(startTime);
    const timeInMs = (endTime[0] * 1000) + (endTime[1] / 1e6);
    console.log(`${message} | Execution Time: ${timeInMs.toFixed(2)} ms`);
}
