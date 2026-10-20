# SmartWash / SmartWash — 6-screen prototype

Files: `index.html`, `style.css`, `script.js`.

Open this folder in VS Code and run `index.html` with Live Server.

Screens: Welcome, Register, Sign In, Google account chooser, Home/Laundry Dashboard, Forgot Password. Back arrows on Register and Sign In return to Welcome; the Forgot Password arrow returns to Sign In; the Google chooser has its own back/cancel controls.

Demo credentials: `demo@smartwash.com` / `Laundry123`.

Google sign-in, email/SMS verification, and machine booking are simulated. This is a front-end assessment prototype; real authentication needs a backend, secure password hashing, database, OAuth and email/SMS integration. Demo accounts are stored in browser localStorage and must not be used for real passwords.


The `smartwash-logo.png` file is cropped from the logo image you supplied and is used in the header/brand areas. Keep it in the same folder as `index.html`.


## Icon update
Generic grid/symbol placeholders have been replaced with relevant inline SVG icons for washers, dryers, alerts, calendar booking, QR scanning, wallet, lock, settings, home, activity, and profile. The SVG icons are embedded in `index.html`, so no icon package is needed.
