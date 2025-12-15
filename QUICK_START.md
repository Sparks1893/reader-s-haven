# Quick Start Guide

## For Developers

### Setup
```bash
# 1. Clone repository
git clone https://github.com/Sparks1893/reader-s-haven.git
cd reader-s-haven

# 2. Install dependencies
npm install

# 3. Choose your workflow:
```

### Option A: Standalone React App (Development)
```bash
npm run dev
# Opens at http://localhost:8080
```

### Option B: WordPress Plugin (Development)
```bash
# 1. Build the plugin
npm run build:wordpress

# 2. Copy to WordPress
cp -r wordpress-plugin /path/to/wp-content/plugins/readers-haven

# 3. Activate in WordPress admin
# Or via WP-CLI:
wp plugin activate readers-haven
```

### Option C: WordPress Plugin (Watch Mode)
```bash
# Keep terminal open to watch for changes
npm run build

# In another terminal, sync changes to WordPress
watch -n 1 'cp dist/* /path/to/wp-content/plugins/readers-haven/dist/'
```

## For Users

### Installation
1. Go to WordPress Dashboard → Plugins → Add New
2. Upload `readers-haven.zip`
3. Activate the plugin
4. Add `[readers-haven]` to any page/post

### First Steps
1. Navigate to a page with the shortcode
2. Login (if required for your site)
3. Click "Add Book" to add your first book
4. Track your reading journey!

## File Reference

| File | Purpose |
|------|---------|
| `src/App.tsx` | Auto-detects React or WordPress mode |
| `src/pages/WordPress.tsx` | WordPress-specific UI |
| `wordpress-plugin/readers-haven.php` | Main plugin file |
| `wordpress-plugin/README.md` | Plugin documentation |
| `WORDPRESS_INTEGRATION.md` | Technical integration guide |
| `DEPLOYMENT.md` | Distribution & deployment guide |

## Troubleshooting

### Build fails with "vite not found"
```bash
npm install
```

### Plugin doesn't load
- Check `wordpress-plugin/readers-haven.php` exists
- Verify file permissions: `chmod -R 755 wordpress-plugin/`
- Check WordPress error logs

### React app doesn't show in WordPress
- Verify shortcode: `[readers-haven]`
- Clear cache: browser and WordPress
- Check browser console for errors

### Database errors
```bash
# Reset plugin (WordPress admin):
# 1. Deactivate plugin
# 2. Activate again (recreates tables)
```

## Common Commands

```bash
# Development
npm run dev              # Start dev server
npm run build           # Build React app
npm run build:wordpress # Build for WordPress plugin
npm run lint            # Check code quality
npm run preview         # Preview production build
```

## Getting Help

1. Check [WORDPRESS_INTEGRATION.md](WORDPRESS_INTEGRATION.md)
2. Review [DEPLOYMENT.md](DEPLOYMENT.md)
3. Check existing [GitHub Issues](https://github.com/Sparks1893/reader-s-haven/issues)
4. Create new issue with details

## Version Info

- **Node.js**: 16+
- **npm**: 7+
- **PHP**: 8.0+
- **WordPress**: 5.9+

---

Happy reading! 📚
