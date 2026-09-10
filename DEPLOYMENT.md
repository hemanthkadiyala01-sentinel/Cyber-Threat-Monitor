# CyberSentinel SIEM Dashboard

A modern, real-time Security Operations Center (SOC) SIEM dashboard built with React, Vite, and Tailwind CSS. Features real-time threat alerts, analytics visualizations, and a comprehensive SOC command interface.

## Features

✨ **Real-Time Threat Monitoring**

- Live alert streaming with 8-second refresh intervals
- Severity-based color coding (Critical, High, Medium, Low)
- Real-time threat volume analytics

🎨 **Modern UI/UX**

- Cyberpunk-inspired dark theme with cyan/purple accents
- Glass-morphism UI panels with --webkit-backdrop-filter: blur(10px); and backdrop-filter: blur(10px)
- Fully responsive design (mobile, tablet, desktop)
- Dark/Light theme toggle

🛡️ **SOC Capabilities**

- Multi-page dashboard with dedicated modules:
  - **Dashboard**: Main control surface with threat overview
  - **Alerts**: Real-time threat alerts management
  - **Threat Intelligence**: IOC tracking and CVE monitoring
  - **Incidents**: Incident response coordination
  - **Assets**: Asset inventory and posture tracking
  - **Log Sources**: SIEM ingestion pipeline management
  - **Settings**: SOC configuration and user management

🔐 **Security**

- Session-based authentication with localStorage
- Protected routes for authenticated users
- Role-based UI adjustments

## Tech Stack

- **Frontend**: React 19.2.6
- **Build Tool**: Vite 8.0.12 (Lightning-fast HMR)
- **Styling**: Tailwind CSS 4.3.0 + CSS Grid animations
- **Routing**: React Router 7.9.4
- **Icons**: Lucide React 1.16.0
- **State Management**: React Context API

## Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

```bash
# Clone repository
cd cyber-threat-monitor

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

**Default Login Credentials:**

- Email: `analyst@soc.local`
- Password: `password123`

### Build for Production

```bash
npm run build
```

This generates an optimized production bundle in the `dist/` directory.

## Deployment

### Option 1: Vercel (Recommended)

1. **Push code to GitHub**

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/cyber-threat-monitor.git
git push -u origin main
```

1. **Deploy to Vercel**

- Visit [vercel.com](https://vercel.com)
- Click "New Project"
- Import your GitHub repository
- Framework: Vite (auto-detected)
- Click "Deploy"

1. **Your dashboard is live!** Access it at `https://cyber-threat-monitor-XXXXX.vercel.app`

### Option 2: Netlify

1. **Push code to GitHub** (same as above)

1. **Deploy to Netlify**

- Visit [netlify.com](https://netlify.com)
- Click "New site from Git"
- Connect GitHub and select your repository
- Build command: `npm run build`
- Publish directory: `dist`
- Click "Deploy"

1. **Your dashboard is live!** Access it at `https://cyber-threat-monitor-XXXXX.netlify.app`

### Option 3: GitHub Pages

1. Update `vite.config.js`:

```javascript
export default defineConfig({
  base: '/cyber-threat-monitor/',
  plugins: [react(), tailwindcss()],
})
```

1. Update `package.json` scripts:

```json
"deploy": "gh-pages -d dist"
```

1. Install gh-pages:

```bash
npm install --save-dev gh-pages
```

1. Deploy:

```bash
npm run build
npm run deploy
```

### Option 4: Docker

```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Build and run:

```bash
docker build -t cyber-threat-monitor .
docker run -p 80:80 cyber-threat-monitor
```

## Project Structure

```text
src/
├── components/
│   ├── dashboard/      # Dashboard-specific components
│   ├── layout/         # Layout components (Sidebar, Navbar)
│   └── ui/             # Reusable UI components
├── context/            # React Context (Auth, Theme)
├── pages/              # Page components
├── data/               # Mock data and constants
├── App.jsx             # Main App component
├── main.jsx            # Entry point
└── index.css           # Global styles

public/                 # Static assets
dist/                   # Production build (generated)
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

### Customization

### Update Mock Data

Edit `src/data/mockData.js` to modify:

- Statistics and KPIs
- Threat alert samples
- Trend data

### Connect Real API

Update context/api service to connect to your SIEM backend:

```javascript
// Example: src/services/api.js
export const fetchAlerts = async () => {
  const response = await fetch(`${process.env.VITE_API_URL}/alerts`);
  return response.json();
};
```

### Customize Branding

- Update company name in `src/components/layout/Sidebar.jsx`
- Change logo in `public/favicon.svg`
- Modify color scheme in `src/index.css`

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 15+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- **Dev Build**: ~1.2s startup
- **Production Build**: 258KB JS + 29KB CSS (gzipped: 82KB + 6KB)
- **Lighthouse**: 95+ Performance score

## Security Considerations

⚠️ **Current State**: Demo/Development mode

- Mock authentication (no real validation)
- No HTTPS in local dev
- No API authentication tokens

**For Production**:

1. Implement real authentication (OAuth2, SAML)
2. Use HTTPS only
3. Add API key management
4. Implement rate limiting
5. Add CORS configuration
6. Use environment variables for secrets
7. Add input validation and sanitization

## License

MIT

## Contributing

1. Create a feature branch
2. Make your changes
3. Test locally (`npm run dev`)
4. Build and verify (`npm run build && npm run preview`)
5. Submit a pull request

## Support

For issues and questions:

- Check the [Issues](https://github.com/YOUR_USERNAME/cyber-threat-monitor/issues) page
- Review the [Discussions](https://github.com/YOUR_USERNAME/cyber-threat-monitor/discussions)

## Roadmap

- [ ] Real data integration with actual SIEM
- [ ] WebSocket for live alert streaming
- [ ] User management and role-based access
- [ ] Custom alert rules builder
- [ ] Advanced analytics and reporting
- [ ] Mobile app (React Native)
- [ ] Dark mode optimization
- [ ] Internationalization (i18n)

---

### Built with ❤️ for Security Operations Teams
