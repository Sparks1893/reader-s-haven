# Reader's Haven WordPress Plugin

This is the WordPress plugin version of Reader's Haven, a comprehensive book reading tracker and community platform.

## Installation

### Prerequisites
- WordPress 5.9 or later
- PHP 8.0 or later
- Node.js 16+ and npm/yarn/bun (for development)

### Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Sparks1893/reader-s-haven.git
   cd reader-s-haven
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Build the plugin**
   ```bash
   npm run build
   # or
   bun run build
   ```

   This will generate the production-ready files in `wordpress-plugin/dist/`

4. **Copy plugin to WordPress**
   ```bash
   # Copy the entire wordpress-plugin directory to your WordPress plugins folder
   cp -r wordpress-plugin /path/to/wp-content/plugins/readers-haven
   ```

5. **Activate the plugin**
   - Go to WordPress admin dashboard
   - Navigate to Plugins
   - Find "Reader's Haven" and click "Activate"

## Usage

### For Site Visitors
Add the shortcode to any page or post:
```
[readers-haven]
```

### For Site Administrators
- Access Reader's Haven admin panel from the main WordPress menu
- Manage books and settings from the dedicated admin interface

## Database Structure

The plugin automatically creates the following table on activation:
- `wp_rh_books` - Stores user's book entries

## Features

- 📚 **Book Tracking** - Add and manage your reading list
- 📊 **Reading Statistics** - Track your reading progress
- 🏆 **Achievements** - Unlock badges and achievements
- 💬 **Community** - Share recommendations and reviews
- 🏷️ **Genre Tracking** - Organize books by genre
- ⭐ **Ratings & Reviews** - Rate and review books
- 📱 **Responsive Design** - Works on all devices

## REST API Endpoints

The plugin provides the following REST endpoints (all require authentication):

- `GET /wp-json/readers-haven/v1/books` - Get all user's books
- `POST /wp-json/readers-haven/v1/books` - Create a new book entry
- `GET /wp-json/readers-haven/v1/books/:id` - Get specific book
- `PUT /wp-json/readers-haven/v1/books/:id` - Update book entry
- `DELETE /wp-json/readers-haven/v1/books/:id` - Delete book entry

## Development

### Project Structure
```
wordpress-plugin/
├── readers-haven.php      # Main plugin file with headers and hooks
├── dist/                  # Built React app (generated)
│   ├── main.js           # Main React bundle
│   └── style.css         # Compiled styles
```

### Building for Development
```bash
npm run build:dev
```

### Development Server
```bash
npm run dev
```

## Code Architecture

### Frontend
- **React** - UI framework
- **Vite** - Build tool
- **TypeScript** - Type safety
- **shadcn/ui** - Component library
- **Tailwind CSS** - Styling

### Backend
- **WordPress REST API** - API endpoints
- **WordPress Database** - Data persistence
- **PHP 8.0** - Server-side logic

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the GPL v2 or later. See the main plugin file for details.

## Support

For issues, feature requests, or questions, please visit the [GitHub repository](https://github.com/Sparks1893/reader-s-haven).

## Version

Current Version: 0.1.0
