module.exports = {
    MODE: process.env.MODE || 'CSRF_ONLY' // 'FULL' runs all checks, 'CSRF_ONLY' runs only CSRF token checks, 'COOKIE_ONLY' runs only Samesite cookie checks
  };