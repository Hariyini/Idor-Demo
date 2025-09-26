# IDOR-Demo

A small Node.js/Express demo to illustrate **Insecure Direct Object Reference (IDOR) / Broken Access Control**.

## Features

- **Vulnerable endpoint:** `/profile/:id` initially returned any user's data without checking the session.
- **Authorization middleware:** `ensureSameUser` prevents unauthorized access.
- **Helmet:** Adds secure HTTP headers and hides framework info.
- **CSRF protection:** Using `csurf` middleware to prevent cross-site request forgery.
- **Secure cookies:** `httpOnly`, `secure` (HTTPS-only), and `sameSite` flags for safer sessions.
- **Demo-ready:** Test locally using curl commands or Postman.
- **Snyk scan:** Can be imported to Snyk for security analysis and verification.

## How to Run

```bash
git clone <your-repo-url>
cd idor-demo
npm install
node index.js
