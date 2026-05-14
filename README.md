# Eventara 🌟
> Event Management App — React + Vite

A mobile-first event management app with a responsive desktop layout.

---

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) v18 or higher
- npm (comes with Node)

### Setup (one time)

```bash
# 1. Navigate into the project folder
cd eventara

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

Then open **http://localhost:5173** in your browser.

---

## 🔑 Demo Credentials

| Role  | Email               | Password   |
|-------|---------------------|------------|
| Admin | admin@event.com     | admin123   |
| Guest | priya@guest.com     | guest123   |
| Guest | rahul@guest.com     | guest123   |
| Guest | sneha@guest.com     | guest123   |

**Try as guest:** Login with a guest account and enter invite code `ZENITH25` to join the demo event.

---

## 🏗️ Project Structure

```
eventara/
├── index.html          # HTML entry point
├── vite.config.js      # Vite configuration
├── package.json        # Dependencies
└── src/
    ├── main.jsx        # React root
    ├── App.jsx         # Full application
    └── index.css       # Global styles + animations
```

---

## 📱 Responsive Layout

- **Desktop (≥769px):** Fixed sidebar navigation on the left
- **Mobile (<768px):** Bottom tab bar navigation

---

## 🛠️ Build for Production

```bash
npm run build
npm run preview   # preview the production build locally
```

The output goes to the `dist/` folder.
