<?php
/**
 * Plugin Name: Reader's Haven
 * Plugin URI: https://github.com/Sparks1893/reader-s-haven
 * Description: A comprehensive book reading tracker and community platform for book enthusiasts
 * Version: 0.1.0
 * Author: Reader's Haven Contributors
 * Author URI: https://github.com/Sparks1893
 * License: GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: readers-haven
 * Domain Path: /languages
 * Requires PHP: 8.0
 * Requires at least: 5.9
 */

// Exit if accessed directly
if ( ! defined( 'ABSPATH' ) ) {
exit;
}

/**
 * Define plugin constants
 */
define( 'READERS_HAVEN_VERSION', '0.1.0' );
define( 'READERS_HAVEN_PATH', plugin_dir_path( __FILE__ ) );
define( 'READERS_HAVEN_URL', plugin_dir_url( __FILE__ ) );
define( 'READERS_HAVEN_PLUGIN_SLUG', 'readers-haven' );

/**
 * Include required files
 */
require_once READERS_HAVEN_PATH . 'includes/class-database.php';
require_once READERS_HAVEN_PATH . 'includes/class-assets.php';
require_once READERS_HAVEN_PATH . 'includes/class-api.php';
require_once READERS_HAVEN_PATH . 'includes/class-admin.php';
require_once __DIR__ . '/includes/class-page-installer.php';

/**
 * Main plugin class
 */
class ReadersHaven {
private static $instance = null;

public static function get_instance() {
if ( is_null( self::$instance ) ) {
self::$instance = new self();
}
return self::$instance;
}

public function __construct() {
$this->init_hooks();
}

private function init_hooks() {
add_action( 'wp_enqueue_scripts', array( 'Readers_Haven_Assets', 'enqueue_frontend_assets' ) );
add_action( 'admin_enqueue_scripts', array( 'Readers_Haven_Assets', 'enqueue_admin_assets' ) );
add_action( 'rest_api_init', array( 'Readers_Haven_API', 'register_endpoints' ) );
add_shortcode( 'readers-haven', array( $this, 'render_shortcode' ) );
add_action( 'admin_menu', array( 'Readers_Haven_Admin', 'add_admin_menu' ) );
}

/**
 * Render shortcode
 */
public function render_shortcode( $atts ) {
return '<div id="readers-haven-app" class="readers-haven-container"></div>';
}
}

/**
 * Initialize plugin
 */
function readers_haven_init() {
ReadersHaven::get_instance();
}

add_action( 'plugins_loaded', 'readers_haven_init' );

/**
 * Plugin activation hook
 */
register_activation_hook( __FILE__, function () {
	Readers_Haven_Database::create_tables();
	ReadersHaven_Page_Installer::install();
} );

/**
 * Plugin deactivation hook
 */
function readers_haven_deactivate() {
	Readers_Haven_Database::drop_tables();
}

register_deactivation_hook( __FILE__, 'readers_haven_deactivate' );
