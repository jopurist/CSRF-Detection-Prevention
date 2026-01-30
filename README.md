# CSRF Attack Detection and Prevention Middleware

## Overview
My 4th year's Cybersecurity course project. Tasked with coming up with a new and feasible solution to detect and mitagate Cross-Stie Request Forgery (CSRF) web vulerability.
Our answer is to try combining traditional strategies with UBA (User Behavior Analysis) to make a multi-layered request validation.

## What is CSRF?
CSRF (Cross-Site Request Forgery) is a web security vulnerability where an attacker tricks a user’s browser into sending an unintended, authenticated request to a trusted website. Because the browser automatically includes session cookies, the server believes the request is legitimate.

Impact:
CSRF can allow attackers to perform actions on behalf of a victim without their consent, such as changing account details, making purchases, transferring funds, or modifying settings—depending on what the victim is authorized to do.

Usual Mitigation Strategies:

Use CSRF tokens (unique, unpredictable values validated by the server for each state-changing request).

Enforce SameSite cookies (e.g., SameSite=Lax or Strict).

Require re-authentication or CAPTCHAs for sensitive actions.

## Objectives
- Even with the exsisting solutions in-place, CSRF still remains in the OWASP top 10.
- We need to come up with a method to generate and store user navigation data.
- Our objective is to come up with a feasible idea to help/improve a detection and prevention method without sacraficing too much on computation power.

## Architecture / Setup
- Session Management: Upon login, a unique session_id is generated and stored server-side, sent securely to the client as a SameSite=Strict HTTP-only cookie, ensuring requests originate from the user’s session.
- CSRF Token Validation: A CSRF token is generated per session and must accompany all actions via the X-CSRF-Token header. The server validates this token to ensure requests are legitimate.
- Navigation Sequence Enforcement: A strict page sequence is maintained (login → home → cart → add_address), validated through a page sequence. Any invalid transitions or unauthorized actions are blocked.
- Layered Validation: All requests must satisfy:
a. Valid session and CSRF token.
b. Correct page sequence for actions.
- ![Capture](https://github.com/user-attachments/assets/fbe6f33c-41d7-44e6-969d-b7ec457ae65b)

## Results
- Robust CSRF Prevention: By combining CSRF tokens, navigation sequence validation, and SameSite cookies, the system effectively blocks both cross-site and same-site forgery attacks.
- Defense-in-Depth: Unlike traditional methods that rely on a single layer of defense, our system introduces multiple layers of verification, making it significantly more resilient to CSRF attacks.
- Navigation Enforcement: Invalid navigation attempts were successfully detected and blocked.
- ![Capture](https://github.com/user-attachments/assets/0ac19b21-8263-4beb-b4c5-fd9119fb6903)
- ![Capture2](https://github.com/user-attachments/assets/8472b1e3-a1e0-47c4-8261-26d428f7f9f5)

