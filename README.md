# Canteen Bill Generator

A simple web application for canteen management that allows owners to manage food items and prices, generate QR codes for customer access, handle prebookings, and generate bills. **Works entirely in the browser - no server required!**

## Features

- **Owner Dashboard**: Add, edit, and delete food items with prices
- **QR Code Generation**: Generate QR codes that customers can scan to access the menu
- **Customer Prebooking**: Customers can browse menu, add items to cart, and place prebooking orders
- **Order Management**: View all orders, filter by status, and mark orders as completed
- **Bill Generation**: Generate printable bills for any order

## Setup Instructions

### No Installation Required!

This application runs entirely in your web browser using localStorage for data storage. No server, no Node.js, no installation needed!

### Quick Start

1. Simply open `public/index.html` in your web browser
   - You can double-click the file, or
   - Right-click and select "Open with" your preferred browser

2. That's it! The application is ready to use.

### Alternative: Using a Local Web Server (Optional)

If you prefer to use a local web server (for better QR code URLs), you can:

**Option 1: Python (if installed)**
```bash
cd canteen-app/public
python -m http.server 8000
```
Then open: `http://localhost:8000`

**Option 2: Node.js (if installed)**
```bash
cd canteen-app
npm install
npm start
```
Then open: `http://localhost:3000`

**Option 3: VS Code Live Server**
- Install the "Live Server" extension in VS Code
- Right-click on `index.html` and select "Open with Live Server"

## Usage

### Owner Dashboard (index.html)
- Add new food items with names and prices
- Edit existing food items
- Delete food items
- Generate QR code for customers to scan (links to customer.html)

### Customer Menu (customer.html)
- Browse available food items
- Add items to cart with quantities
- Submit prebooking orders
- Receive order confirmation with order number

### Orders Management (orders.html)
- View all orders (pending and completed)
- Filter orders by status
- Mark orders as completed
- Generate printable bills for orders

## Project Structure

```
canteen-app/
├── public/
│   ├── index.html        # Owner dashboard
│   ├── customer.html     # Customer menu/prebooking page
│   ├── orders.html       # Order management page
│   ├── styles.css        # Shared styles
│   ├── data-manager.js   # Client-side data management (localStorage)
│   ├── app.js            # Owner dashboard JavaScript
│   ├── customer.js       # Customer page JavaScript
│   └── orders.js          # Orders page JavaScript
├── server.js              # Optional Node.js server (not required)
├── package.json           # Optional dependencies (not required)
└── README.md              # This file
```

## How It Works

- **Data Storage**: All data (menu items and orders) is stored in the browser's localStorage
- **No Backend**: Everything runs client-side using vanilla JavaScript
- **QR Codes**: Generated client-side using QRCode.js library (loaded via CDN)
- **Cross-Page Data**: All pages share the same localStorage, so data persists across pages

## Notes

- No authentication is required (local use only)
- Data is stored in browser localStorage (cleared if browser data is cleared)
- Works offline - no internet connection needed after initial page load
- QR codes work best when accessed via a web server (for proper URLs)
- Orders auto-refresh every 5 seconds on the orders page

