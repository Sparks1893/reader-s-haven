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
		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_assets' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_admin_assets' ) );
		add_action( 'rest_api_init', array( $this, 'register_rest_endpoints' ) );
		add_shortcode( 'readers-haven', array( $this, 'render_shortcode' ) );
		add_action( 'admin_menu', array( $this, 'add_admin_menu' ) );
	}

	/**
	 * Enqueue frontend assets
	 */
	public function enqueue_assets() {
		// Enqueue React app
		wp_enqueue_script(
			'readers-haven-app',
			READERS_HAVEN_URL . 'dist/index.js',
			array(),
			READERS_HAVEN_VERSION,
			true
		);

		// Enqueue styles
		wp_enqueue_style(
			'readers-haven-styles',
			READERS_HAVEN_URL . 'dist/index.css',
			array(),
			READERS_HAVEN_VERSION
		);

		// Pass AJAX URL and nonce to frontend
		wp_localize_script(
			'readers-haven-app',
			'readersHavenData',
			array(
				'ajax_url'        => admin_url( 'admin-ajax.php' ),
				'rest_url'        => rest_url( 'readers-haven/v1' ),
				'nonce'           => wp_create_nonce( 'readers-haven-nonce' ),
				'current_user_id' => get_current_user_id(),
				'is_user_logged_in' => is_user_logged_in(),
			)
		);
	}

	/**
	 * Enqueue admin assets
	 */
	public function enqueue_admin_assets( $hook ) {
		if ( strpos( $hook, 'readers-haven' ) === false ) {
			return;
		}

		wp_enqueue_script(
			'readers-haven-admin',
			READERS_HAVEN_URL . 'dist/index.js',
			array(),
			READERS_HAVEN_VERSION,
			true
		);

		wp_enqueue_style(
			'readers-haven-admin-styles',
			READERS_HAVEN_URL . 'dist/index.css',
			array(),
			READERS_HAVEN_VERSION
		);
	}

	/**
	 * Register REST API endpoints
	 */
	public function register_rest_endpoints() {
		// Books endpoint
		register_rest_route(
			'readers-haven/v1',
			'/books',
			array(
				array(
					'methods'             => 'GET',
					'callback'            => array( $this, 'get_books' ),
					'permission_callback' => '__return_true',
				),
				array(
					'methods'             => 'POST',
					'callback'            => array( $this, 'create_book' ),
					'permission_callback' => array( $this, 'check_user_permission' ),
				),
			)
		);

		// Single book endpoint
		register_rest_route(
			'readers-haven/v1',
			'/books/(?P<id>\d+)',
			array(
				array(
					'methods'             => 'GET',
					'callback'            => array( $this, 'get_book' ),
					'permission_callback' => '__return_true',
				),
				array(
					'methods'             => 'PUT',
					'callback'            => array( $this, 'update_book' ),
					'permission_callback' => array( $this, 'check_user_permission' ),
				),
				array(
					'methods'             => 'DELETE',
					'callback'            => array( $this, 'delete_book' ),
					'permission_callback' => array( $this, 'check_user_permission' ),
				),
			)
		);
	}

	/**
	 * Check user permission
	 */
	public function check_user_permission() {
		return is_user_logged_in();
	}

	/**
	 * Get books
	 */
	public function get_books( $request ) {
		global $wpdb;
		
		$table_name = $wpdb->prefix . 'rh_books';
		$user_id    = get_current_user_id();

		$books = $wpdb->get_results(
			$wpdb->prepare(
				"SELECT * FROM $table_name WHERE user_id = %d",
				$user_id
			)
		);

		return new WP_REST_Response( $books, 200 );
	}

	/**
	 * Get single book
	 */
	public function get_book( $request ) {
		global $wpdb;
		
		$table_name = $wpdb->prefix . 'rh_books';
		$book_id    = $request->get_param( 'id' );
		$user_id    = get_current_user_id();

		$book = $wpdb->get_row(
			$wpdb->prepare(
				"SELECT * FROM $table_name WHERE id = %d AND user_id = %d",
				$book_id,
				$user_id
			)
		);

		if ( $book ) {
			return new WP_REST_Response( $book, 200 );
		}

		return new WP_REST_Response( array( 'error' => 'Book not found' ), 404 );
	}

	/**
	 * Create book
	 */
	public function create_book( $request ) {
		global $wpdb;
		
		$table_name = $wpdb->prefix . 'rh_books';
		$user_id    = get_current_user_id();
		$params     = $request->get_json_params();

		$wpdb->insert(
			$table_name,
			array(
				'user_id'        => $user_id,
				'title'          => sanitize_text_field( $params['title'] ?? '' ),
				'author'         => sanitize_text_field( $params['author'] ?? '' ),
				'cover_url'      => esc_url( $params['coverUrl'] ?? '' ),
				'genre'          => sanitize_text_field( wp_json_encode( $params['genre'] ?? array() ) ),
				'status'         => sanitize_text_field( $params['status'] ?? 'to-read' ),
				'rating'         => intval( $params['rating'] ?? 0 ),
				'spice_rating'   => intval( $params['spiceRating'] ?? 0 ),
				'is_favorite'    => intval( $params['isFavorite'] ?? 0 ),
				'is_wishlisted'  => intval( $params['isWishlisted'] ?? 0 ),
				'notes'          => sanitize_textarea_field( $params['notes'] ?? '' ),
				'date_added'     => current_time( 'mysql' ),
			)
		);

		return new WP_REST_Response(
			array( 'id' => $wpdb->insert_id, 'message' => 'Book created successfully' ),
			201
		);
	}

	/**
	 * Update book
	 */
	public function update_book( $request ) {
		global $wpdb;
		
		$table_name = $wpdb->prefix . 'rh_books';
		$book_id    = $request->get_param( 'id' );
		$user_id    = get_current_user_id();
		$params     = $request->get_json_params();

		$wpdb->update(
			$table_name,
			array(
				'title'         => sanitize_text_field( $params['title'] ?? '' ),
				'author'        => sanitize_text_field( $params['author'] ?? '' ),
				'cover_url'     => esc_url( $params['coverUrl'] ?? '' ),
				'genre'         => sanitize_text_field( wp_json_encode( $params['genre'] ?? array() ) ),
				'status'        => sanitize_text_field( $params['status'] ?? 'to-read' ),
				'rating'        => intval( $params['rating'] ?? 0 ),
				'spice_rating'  => intval( $params['spiceRating'] ?? 0 ),
				'is_favorite'   => intval( $params['isFavorite'] ?? 0 ),
				'is_wishlisted' => intval( $params['isWishlisted'] ?? 0 ),
				'notes'         => sanitize_textarea_field( $params['notes'] ?? '' ),
			),
			array(
				'id'      => $book_id,
				'user_id' => $user_id,
			)
		);

		return new WP_REST_Response( array( 'message' => 'Book updated successfully' ), 200 );
	}

	/**
	 * Delete book
	 */
	public function delete_book( $request ) {
		global $wpdb;
		
		$table_name = $wpdb->prefix . 'rh_books';
		$book_id    = $request->get_param( 'id' );
		$user_id    = get_current_user_id();

		$wpdb->delete(
			$table_name,
			array(
				'id'      => $book_id,
				'user_id' => $user_id,
			)
		);

		return new WP_REST_Response( array( 'message' => 'Book deleted successfully' ), 200 );
	}

	/**
	 * Render shortcode
	 */
	public function render_shortcode( $atts ) {
		return '<div id="readers-haven-app" class="readers-haven-container"></div>';
	}

	/**
	 * Add admin menu
	 */
	public function add_admin_menu() {
		add_menu_page(
			__( "Reader's Haven", 'readers-haven' ),
			__( "Reader's Haven", 'readers-haven' ),
			'manage_options',
			'readers-haven',
			array( $this, 'admin_page' ),
			'dashicons-book'
		);
	}

	/**
	 * Admin page
	 */
	public function admin_page() {
		echo '<div id="readers-haven-admin" class="readers-haven-admin-container"></div>';
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
 * Create database tables on plugin activation
 */
function readers_haven_activate() {
	global $wpdb;
	
	$table_name      = $wpdb->prefix . 'rh_books';
	$charset_collate = $wpdb->get_charset_collate();

	$sql = "CREATE TABLE IF NOT EXISTS $table_name (
		id bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
		user_id bigint(20) UNSIGNED NOT NULL,
		title varchar(255) NOT NULL,
		author varchar(255) NOT NULL,
		cover_url varchar(500),
		genre longtext,
		series longtext,
		status varchar(50) NOT NULL DEFAULT 'to-read',
		rating int(11) DEFAULT 0,
		spice_rating int(11) DEFAULT 0,
		is_favorite tinyint(1) DEFAULT 0,
		is_wishlisted tinyint(1) DEFAULT 0,
		notes longtext,
		date_added datetime DEFAULT CURRENT_TIMESTAMP,
		date_completed datetime,
		PRIMARY KEY (id),
		KEY user_id (user_id)
	) $charset_collate;";

	require_once ABSPATH . 'wp-admin/includes/upgrade.php';
	dbDelta( $sql );
}

register_activation_hook( __FILE__, 'readers_haven_activate' );

/**
 * Clean up on plugin deactivation
 */
function readers_haven_deactivate() {
	// Perform cleanup if needed
}

register_deactivation_hook( __FILE__, 'readers_haven_deactivate' );
