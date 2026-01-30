CSRF Detection and Prevention System

Overview

This project implements a multi-layered approach to detect and prevent Cross-Site Request Forgery (CSRF) attacks. It integrates navigation sequence validation, CSRF token validation, and SameSite cookies to ensure the security and integrity of sensitive user requests.

The system has been built on a simulated e-commerce platform with the following pages:
1. Login Page – User authentication
2. Home Page – Adding items to the cart
3. Cart Page – Removing items, confirming payments, and navigating to the Add Address page
4. Add Address Page – Submitting the shipping address

Key Features

1. Session Management
- Unique `session_id` is generated on login
- Sent as a SameSite HTTP-only cookie

2. CSRF Token Validation
- Secure **CSRF token** generated per session
- Required for all sensitive POST requests

3. Navigation Sequence Validation
- Tracks and validates user's page transitions using a `page_sequence` cookie
- Blocks requests that violate predefined navigation rules

4. Multi-Layered Validation
Ensures every sensitive request meets **all three conditions**:
- A valid session ID (SameSite cookies)
- A valid CSRF token
- Correct navigation sequence

Prerequisites

Before running the project, ensure you have the following installed:

- Node.js (version 14 or higher)
- npm (comes with Node.js)
- A modern web browser (e.g., Chrome, Firefox)

Installation

1. Install dependencies:
   ```bash
   npm install
   ```

Running the Application

Environment Modes

The project demo have three modes:
- FULL mode: Runs all security checks
- CSRF_ONLY mode: Only validates CSRF tokens for performance comparison
- COOKIE_ONLY mode: Only validates SameSite Cookie for performance comparison

To select the modes, goto ..\CSRF-Detection-and-Prevention\api\settings.js
- Change the 'FULL' into whichever mode you want to test

To launch the simulated e-commerce website:
Ternimal run:
  node server/server.js
  ```


Testing the Application

Login Credentials
- Username: user1
- Password: 1user

Simulating CSRF Attack

1. Run 'attacker.html' on a different port (e.g., localhost:8080)
	1.1. For our testing, we use VSCode extension called "Five Server"
	1.2. Then right click on the 'attacker.html' code, and click "Open with Five Server"
2. Attempt to send unauthorized requests

Performance Comparison

1. Start the server in FULL/CSRF_ONLY/COOKIE_ONLY mode
2. Perform actions and note response times
3. Restart in a different mode
4. Compare response times

Expected Results

Legitimate Requests
- Processed successfully if CSRF token, session ID, and navigation sequence are valid

Unauthorized Requests
Blocked with error messages:
- "Invalid CSRF token"
- "Invalid or expired session"
- "Navigation from [previousPage] to [currentPage] not allowed"

Common Issues

Port Conflicts
If localhost:3000 is already in use, update the port in `server/server.js`:
```javascript
const PORT = process.env.PORT || 4000;
```

Session Expiration
- Sessions expire after 30 minutes of inactivity
- Log in again to generate a new session

Cross-Site Testing
Ensure the attacker page runs on a different port or origin for accurate CSRF simulation


