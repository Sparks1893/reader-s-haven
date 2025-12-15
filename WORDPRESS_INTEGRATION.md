# WordPress Plugin Integration Guide

## Overview

Reader's Haven has been successfully adapted as a WordPress plugin while maintaining a standalone React app option.

## Architecture

### Dual-Mode Support
The application now runs in two modes:

1. **Standalone React App**
   - Traditional SPA with React Router
   - Use when running outside WordPress
   - Accessed via `/` route

2. **WordPress Plugin**
   - Integrated with WordPress REST API
   - Database storage via WordPress tables
   - Shortcode-based embedding
   - Admin dashboard integration

### Mode Detection
The app automatically detects its environment:
```typescript
const isWordPress = typeof (window as any).readersHavenData !== "undefined";
```

## File Structure

```
reader-s-haven/
├── src/
│   ├── App.tsx              # Detects environment and renders appropriately
│   ├── main.tsx             # Updated to support both modes
│   ├── pages/
│   │   └── WordPress.tsx    # WordPress-specific UI
│   ├── hooks/
│   │   └── useWordPressAPI.ts # WordPress API integration
│   └── ... (existing components)
│
├── wordpress-plugin/
│   ├── readers-haven.php    # Main WordPress plugin file
│   ├── dist/                # Built assets (generated)
│   ├── README.md            # Plugin documentation
│   └── .gitignore
│
└── vite.config.ts           # Updated with WordPress output config
```

## Building

### For Standalone React App
```bash
npm run build
# Output: dist/
```

### For WordPress Plugin
```bash
npm run build:wordpress
# Output: wordpress-plugin/dist/
# Also updates vite.config.ts to build directly to this folder
```

## WordPress Integration Details

### Plugin Activation
When activated, the plugin:
1. Creates necessary database tables
2. Registers REST API endpoints
3. Enqueues React app and styles
4. Sets up shortcode handler

### Database Tables
- `wp_rh_books` - Stores book entries per user with fields:
  - `id` - Primary key
  - `user_id` - WordPress user ID
  - `title`, `author`, `cover_url` - Book metadata
  - `genre`, `series` - JSON data
  - `status` - Reading status
  - `rating`, `spice_rating` - User ratings
  - `is_favorite`, `is_wishlisted` - Flags
  - `notes` - User notes
  - `date_added`, `date_completed` - Timestamps

### REST API Endpoints
All endpoints require user authentication:

```
GET    /wp-json/readers-haven/v1/books          # List all books
POST   /wp-json/readers-haven/v1/books          # Create book
GET    /wp-json/readers-haven/v1/books/:id      # Get specific book
PUT    /wp-json/readers-haven/v1/books/:id      # Update book
DELETE /wp-json/readers-haven/v1/books/:id      # Delete book
```

### Shortcode Usage
```
[readers-haven]
```

Place this shortcode on any page or post to display the Reader's Haven app.

## Frontend Integration

### WordPress Data Access
Global object available to React components:
```typescript
window.readersHavenData = {
  ajax_url: string;           // WordPress AJAX URL
  rest_url: string;           // REST API base URL
  nonce: string;              // Security nonce for API requests
  current_user_id: number;    // Current user's ID
  is_user_logged_in: boolean; // Authentication status
}
```

### Using the WordPress API Hook
```typescript
import { useWordPressAPI } from '@/hooks/useWordPressAPI';

export function MyComponent() {
  const { fetchBooks, createBook, updateBook, deleteBook } = useWordPressAPI();
  
  // Use the API functions
  const books = await fetchBooks();
}
```

## Security

### Authentication
- Uses WordPress user authentication
- REST endpoints check user login status
- Nonce validation for CSRF protection

### Data Sanitization
- All user inputs sanitized using WordPress functions
- URLs escaped with `esc_url()`
- Text fields sanitized with `sanitize_text_field()`
- JSON data stored safely

### Authorization
- Books isolated to current user via `user_id`
- Users can only access/modify their own books
- Admin users can manage through admin dashboard

## Development Workflow

### 1. Development Server (for standalone app)
```bash
npm run dev
# http://localhost:8080
```

### 2. Build for WordPress
```bash
npm run build:wordpress
```

### 3. WordPress Local Setup
```bash
# Copy plugin to WordPress
cp -r wordpress-plugin /path/to/wp-content/plugins/readers-haven

# Activate via WordPress admin
```

### 4. Testing
- Verify shortcode displays: `[readers-haven]`
- Test API endpoints via REST client
- Check database tables created
- Verify user isolation

## Customization

### Adding New Endpoints
Edit `/wordpress-plugin/readers-haven.php`:
```php
register_rest_route('readers-haven/v1', '/new-endpoint', [
  'methods' => 'GET|POST',
  'callback' => array($this, 'handle_endpoint'),
  'permission_callback' => '__return_true',
]);
```

### Styling
Tailwind CSS styles automatically build to `dist/style.css`

### Admin Dashboard
Components can use the WordPress admin:
```typescript
if (window.readersHavenData?.is_user_logged_in) {
  // Render admin content
}
```

## Troubleshooting

### REST API not working
- Verify user is logged in
- Check nonce is valid
- Ensure WordPress permalink structure is enabled

### Styles not loading
- Clear browser cache
- Rebuild: `npm run build:wordpress`
- Check network tab for 404s

### Database errors
- Verify plugin activation completed
- Check database permissions
- Review WordPress error logs

## Future Enhancements

- [ ] Admin settings page
- [ ] User dashboard/stats
- [ ] Community features
- [ ] Bulk book import
- [ ] Barcode scanner improvements
- [ ] Social sharing features

## Support

For issues or questions:
1. Check this guide first
2. Review WordPress error logs
3. Visit GitHub repository

## License

GPL v2 or later - See main plugin file for details
