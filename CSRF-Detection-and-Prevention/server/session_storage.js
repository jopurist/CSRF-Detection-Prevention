const sessions = {};

function createSession(sessionId, data) {
    sessions[sessionId] = {
        ...data,
        createdAt: Date.now()
    };
    return sessionId;
}

function getSession(sessionId) {
    const session = sessions[sessionId];
    
    // Check session expiry (30 minutes)
    if (session && (Date.now() - session.createdAt) < 30 * 60 * 1000) {
        return session;
    }
    
    // Remove expired session
    delete sessions[sessionId];
    return null;
}

module.exports = { createSession, getSession };