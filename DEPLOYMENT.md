# Deployment & Distribution Guide

## Distribution Package

To create a distributable WordPress plugin:

```bash
# 1. Build the React app for WordPress
npm run build:wordpress

# 2. Create distribution package
mkdir -p dist/readers-haven
cp -r wordpress-plugin/* dist/readers-haven/
rm -rf dist/readers-haven/dist/node_modules dist/readers-haven/.gitignore

# 3. Create ZIP file
cd dist
zip -r readers-haven.zip readers-haven/
```

## Installation Instructions for End Users

### Method 1: Upload via WordPress Admin
1. Go to WordPress Dashboard → Plugins → Add New
2. Click "Upload Plugin"
3. Select `readers-haven.zip`
4. Click "Install Now"
5. Click "Activate Plugin"

### Method 2: Manual Installation
1. Extract `readers-haven.zip`
2. Upload `readers-haven` folder to `/wp-content/plugins/`
3. Go to WordPress Dashboard → Plugins
4. Find "Reader's Haven" and click "Activate"

### Method 3: Using WP-CLI
```bash
wp plugin install readers-haven.zip --activate
```

## Server Requirements

- WordPress: 5.9 or later
- PHP: 8.0 or later
- MySQL: 5.7 or later
- Disk space: ~50MB (including node_modules in source)
- ~2MB for compiled plugin

## Plugin Structure for Distribution

```
readers-haven/
├── readers-haven.php       # Main plugin file (required)
├── dist/
│   ├── main.js            # React app bundle
│   └── style.css          # Compiled styles
├── README.md              # Plugin README
└── languages/             # For translations (optional)
```

## Configuration & Customization

### Plugin Settings
Currently, the plugin uses default settings. Future versions will include:
- Admin settings page
- User preferences
- Display options

### Hooks & Filters (for developers)

```php
// Add custom fields to book
apply_filters('readers_haven_book_fields', $book);

// Modify REST response
apply_filters('readers_haven_rest_response', $response);

// Custom admin menu
apply_filters('readers_haven_admin_menu', $menu_slug);
```

## Updates & Maintenance

### Updating the Plugin

```bash
# Pull latest changes
git pull origin main

# Rebuild for WordPress
npm run build:wordpress

# Replace plugin files
cp -r wordpress-plugin/dist/* /path/to/wp-content/plugins/readers-haven/dist/
```

### Database Migrations
The plugin schema is created on activation. Future schema changes should:
1. Create migration files in `migrations/`
2. Run on plugin update via `wp_version_option`
3. Handle both creation and upgrades

## Performance Optimization

### Caching
The plugin respects WordPress caching:
```php
wp_cache_set('rh_books_' . $user_id, $books, 'readers-haven', 3600);
wp_cache_get('rh_books_' . $user_id, 'readers-haven');
```

### Asset Loading
- React bundle: Loaded on frontend when shortcode present
- Styles: Inline critical CSS, defer non-critical
- API: Uses native fetch with caching headers

## Multisite Support

For WordPress Multisite installations:
1. Plugin can be network-activated
2. Each site gets isolated data via `user_id`
3. Database tables created per site

## Troubleshooting Deployment

### Plugin not appearing
- Check file permissions (644 for files, 755 for directories)
- Verify `readers-haven.php` has valid plugin header
- Check PHP error logs

### REST API 404
- Enable WordPress permalinks (not plain)
- Clear rewrite rules: `wp_rewrite->flush_rules(false)`

### Database errors
- Verify user has `wp_rh_*` table privileges
- Check error logs in WordPress admin

### Script not loading
- Clear all caches (browser, WordPress, CDN)
- Check network tab for 404s
- Verify file ownership and permissions

## Version Control & Releases

### Git Tagging
```bash
# Tag release
git tag -a v0.1.0 -m "Initial WordPress plugin release"
git push origin v0.1.0
```

### Creating Releases
1. Create tag on GitHub
2. Add release notes
3. Attach built ZIP file
4. Submit to WordPress.org plugin directory (optional)

## WordPress Plugin Directory Submission

When ready to publish on WordPress.org:

1. Create account at wordpress.org/plugins
2. Submit plugin for review
3. Include:
   - Plugin banner (772x250)
   - Plugin icon (256x256)
   - Detailed description
   - Screenshots
   - Changelog

## License Compliance

- Plugin uses GPL v2 or later
- All dependencies must be compatible
- Include LICENSE file in distribution

## Support & Documentation

### User Support
- Document shortcode usage
- Create FAQ
- Link to GitHub issues

### Developer Documentation
- Code is well-commented
- TypeScript provides type safety
- Rest API documented in this guide

---

For questions or issues, refer to the main README or WORDPRESS_INTEGRATION.md files.
