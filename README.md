# FinTech Payments Platform
Open `index.html` in a browser (internet needed for Bootstrap/Chart.js/AOS CDNs). Themes: Light, Dark, Midnight, High Contrast (saved in localStorage). Dashboard: `dashboard/index.html`.

## Offline / blocked CDN
Pages load libraries from `assets/vendor` first, then fall back to jsdelivr, cdnjs and unpkg. To work fully offline: `npm install` then `node setup-vendor.js`.
