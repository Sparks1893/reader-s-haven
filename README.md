# Reader's Haven

A comprehensive book reading tracker and community platform for book enthusiasts. Now available as both a standalone React app and a WordPress plugin!

📚 **Track your reading journey, unlock achievements, and discover your next favorite book.**

## Features

- 📖 **Book Tracking** - Add and manage your reading list with detailed metadata
- 📊 **Reading Statistics** - Track progress, completion rates, and reading streaks
- 🏆 **Achievements** - Unlock badges based on your reading milestones
- 💬 **Community** - Share recommendations and reviews
- 🎯 **Genre Tracking** - Organize books by genre and explore new categories
- ⭐ **Ratings & Reviews** - Rate books and write detailed reviews
- 🏷️ **Series Management** - Track book series and sequels
- 🔖 **Wishlist & Favorites** - Curate your want-to-read list
- 📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile

## Quick Start

### For Standalone React App
```bash
git clone https://github.com/Sparks1893/reader-s-haven.git
cd reader-s-haven
npm install
npm run dev
```

### For WordPress Plugin
```bash
npm install
npm run build:wordpress
# Copy wordpress-plugin folder to wp-content/plugins/
# Activate in WordPress admin
```

See [QUICK_START.md](QUICK_START.md) for detailed instructions.

## Documentation

- 📖 [Quick Start Guide](QUICK_START.md) - Get up and running
- 🔧 [WordPress Integration Guide](WORDPRESS_INTEGRATION.md) - Technical details
- 🚀 [Deployment Guide](DEPLOYMENT.md) - Distribution and deployment
- 📋 [Adaptation Summary](WORDPRESS_ADAPTATION_SUMMARY.md) - What changed

## Technologies

### Frontend
- **React** 18+ - UI framework
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Component library
- **React Router** - Navigation (standalone mode)
- **TanStack Query** - Data fetching

### Backend (WordPress Plugin)
- **WordPress REST API** - API endpoints
- **PHP 8.0+** - Server-side logic
- **MySQL** - Data storage
- **WordPress Security** - Nonce validation, sanitization

## Dual-Mode Architecture

Reader's Haven intelligently detects its environment and renders accordingly:

```
┌─ Standalone React App
│  ├─ npm run dev
│  ├─ Full SPA with React Router
│  └─ Can be deployed anywhere
│
└─ WordPress Plugin
   ├─ npm run build:wordpress
   ├─ Integrated with WordPress REST API
   ├─ Database-backed user data
   └─ Deploy via WordPress admin
```

## Installation Options

### Option 1: Standalone Web App
Deploy anywhere that serves static files:
- Vercel
- Netlify
- GitHub Pages
- Your own server

### Option 2: WordPress Plugin
1. Build: `npm run build:wordpress`
2. Copy `wordpress-plugin` to `wp-content/plugins/readers-haven`
3. Activate in WordPress admin
4. Add `[readers-haven]` shortcode to pages/posts

## API Reference (WordPress Plugin)

REST Endpoints at `/wp-json/readers-haven/v1/`:
- `GET /books` - List all books
- `POST /books` - Create new book
- `GET /books/:id` - Get specific book
- `PUT /books/:id` - Update book
- `DELETE /books/:id` - Delete book

## Development

### Scripts
```bash
npm run dev              # Start dev server (standalone)
npm run build           # Build React app
npm run build:wordpress # Build for WordPress plugin
npm run lint            # Check code quality
npm run preview         # Preview production build
```

### Project Structure
```
reader-s-haven/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/          # Page components
│   ├── hooks/          # Custom React hooks
│   ├── types/          # TypeScript types
│   └── App.tsx         # Main app (handles both modes)
├── wordpress-plugin/   # WordPress plugin
│   ├── readers-haven.php
│   └── dist/           # Built assets
└── docs/               # Documentation
```

## System Requirements

### Standalone
- Node.js 16+
- npm 7+ or equivalent

### WordPress Plugin
- WordPress 5.9+
- PHP 8.0+
- MySQL 5.7+

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## Roadmap

- [ ] Admin dashboard with site-wide statistics
- [ ] User profile customization
- [ ] Social features (followers, sharing)
- [ ] Book recommendations engine
- [ ] Bulk import tools
- [ ] Export functionality
- [ ] Advanced search and filtering

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

GPL v2 or later. See LICENSE file for details.

## Support

- 📖 Documentation: See guides in root directory
- 🐛 Issues: [GitHub Issues](https://github.com/Sparks1893/reader-s-haven/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/Sparks1893/reader-s-haven/discussions)

## Credits

Built with ❤️ for book lovers everywhere.

---

**Latest Version**: 0.1.0 | **Last Updated**: December 2025
