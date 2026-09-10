# 🛡️ CyberSentinel SIEM Dashboard

A cutting-edge **Security Operations Center (SOC) dashboard** for real-time cyber threat monitoring, incident response, and security intelligence. Built with React, Vite, and modern web technologies for lightning-fast performance and an immersive cyberpunk interface.

## ✨ Key Features

🎨 **Modern Cyberpunk UI**

- Neon cyan/purple color scheme with glassmorphism panels
- Real-time animated threat visualization
- Responsive design (mobile, tablet, desktop)
- Dark/light theme toggle

📊 **Real-Time Threat Dashboard**

- Live alert streaming (8-second refresh rate)
- Threat volume analytics with interactive charts
- Attack flow visualization across network layers
- Critical incident highlights with MTTR tracking

🔐 **SOC Command Interface**

- Multi-module platform with dedicated pages for:
  - Alerts management (severity-based filtering)
  - Threat intelligence (IOC tracking, CVE monitoring)
  - Incident response coordination
  - Asset inventory and posture
  - Log source management
  - Team settings and configuration
- Session-based authentication
- Role-ready user management UI

⚡ **Performance Optimized**

- **~1.2s** dev server startup
- **258KB** JS + **29.7KB** CSS (82KB + 6KB gzipped)
- **95+** Lighthouse score
- Zero-config HMR (Hot Module Replacement)

## 🚀 Quick Start

### Prerequisites

- **Node.js** 16+
- **npm** or **yarn**

### Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open browser at http://localhost:5173/
```

**Demo Credentials:**

- Email: `analyst@soc.local`
- Password: `password123`

### Production Build

```bash
# Build optimized bundle
npm run build

# Preview production build locally
npm run preview

# Output is in dist/ folder (ready to deploy)
```

## 🌐 Deploy to the World

### ⭐ Easiest Option: Vercel (1 Click)

```bash
# Step 1: Push to GitHub
git init && git add . && git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/cyber-threat-monitor.git
git push -u origin main

# Step 2: Go to https://vercel.com
# - Click "New Project"
# - Import your GitHub repo
# - Click "Deploy"
# ✅ Done! Your app is live in 2 minutes
```

👉 **[See detailed deployment guides in DEPLOYMENT.md](./DEPLOYMENT.md)**

### Other Options

- **Netlify**: Connect GitHub repo → Auto-deploy
- **GitHub Pages**: Free static hosting
- **Docker**: Self-hosted deployment
- **AWS/Google Cloud**: Enterprise deployment

## 📁 Project Structure

```text
cyber-threat-monitor/
├── src/
│   ├── components/          # React components
│   │   ├── dashboard/       # Dashboard widgets
│   │   ├── layout/          # Layout components
│   │   └── ui/              # Reusable UI elements
│   ├── context/             # React Context (Auth, Theme)
│   ├── pages/               # Page components
│   ├── data/                # Mock data & constants
│   ├── App.jsx              # Main app routing
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles
├── public/                  # Static assets
├── dist/                    # Production build
├── package.json             # Dependencies
├── vite.config.js           # Vite configuration
├── eslint.config.js         # ESLint rules
├── vercel.json              # Vercel deployment config
├── netlify.toml             # Netlify deployment config
└── .env.example             # Environment template
```

## 📚 Available Scripts

| Command | Purpose |
| --------- | --------- |
| `npm run dev` | Start dev server (HMR enabled) |
| `npm run build` | Build production bundle |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## 🛠️ Tech Stack

| Technology | Version | Purpose |
| ----------- | --------- | --------- |
| **React** | 19.2.6 | UI framework |
| **Vite** | 8.0.12 | Build tool & dev server |
| **Tailwind CSS** | 4.3.0 | Styling & utilities |
| **React Router** | 7.9.4 | Client-side routing |
| **Lucide React** | 1.16.0 | Icon library |
| **ESLint** | 10.3.0 | Code linting |

## 🎯 Customization

### Update Dashboard Data

Edit `src/data/mockData.js`:

```javascript
export const stats = [
  { label: "Your Metric", value: "999", trend: "Your Trend", color: "text-cyan-300" }
];
```

### Connect Real SIEM API

Create `src/services/api.js`:

```javascript
export const fetchAlerts = async () => {
  return fetch(`${process.env.VITE_API_URL}/alerts`).then(r => r.json());
};
```

### Change Branding

- Logo: Replace `public/favicon.svg`
- Name: Update in `src/components/layout/Sidebar.jsx`
- Colors: Modify `src/index.css` theme variables

### Add New Page

1. Create `src/pages/MyPage.jsx`
2. Add route in `src/App.jsx`
3. Add nav item in `src/data/mockData.js`

## 📊 Performance Stats

```text
Bundle Size:    258 KB JS + 29.7 KB CSS
Gzipped:        82 KB + 6 KB
Build Time:     ~1.4 seconds
Dev Startup:    ~1.2 seconds
Modules:        1,766 transformed
Lighthouse:     95+ score
ESLint:         ✅ 0 errors
```

## 🔒 Security

### Production Checklist

- [ ] Replace mock authentication with OAuth2/SAML
- [ ] Add HTTPS enforcement
- [ ] Implement API key management
- [ ] Enable rate limiting
- [ ] Add CORS configuration
- [ ] Use environment variables for secrets
- [ ] Add input validation & sanitization
- [ ] Enable Content Security Policy (CSP)

### Environment Variables

```env
VITE_API_URL=https://your-siem-api.example.com
VITE_AUTH_PROVIDER=oauth2
VITE_ENVIRONMENT=production
```

## 🌐 Browser Support

| Browser | Version |
| --------- | --------- |
| Chrome | 90+ ✅ |
| Edge | 90+ ✅ |
| Firefox | 88+ ✅ |
| Safari | 15+ ✅ |
| Mobile Chrome | Latest ✅ |
| Mobile Safari | Latest ✅ |

## 🐛 Troubleshooting

### Port 5173 Already in Use

```bash
npx vite --port 3000
```

### Build Fails

```bash
rm -rf node_modules dist
npm install
npm run build
```

### Module Not Found

```bash
npm install
npm run dev
```

## 📚 Documentation

- **[QUICK_DEPLOY.md](./QUICK_DEPLOY.md)** - One-page deploy guide
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Comprehensive deployment guide
- **[.env.example](./.env.example)** - Environment variables template

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT License - See LICENSE file for details

## 🚀 Live Demo

Check the deployment guides to get your own instance running!

👉 **[Go Live Now with QUICK_DEPLOY.md](./QUICK_DEPLOY.md)**

---

**Built with ❤️ for Security Teams** | [View Documentation](./DEPLOYMENT.md) | [Report Issues](https://github.com/YOUR_USERNAME/cyber-threat-monitor/issues)
