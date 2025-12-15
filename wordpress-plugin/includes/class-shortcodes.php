<?php
/**
 * Shortcodes for the plugin
 *
 * @package ReadersHaven
 */

// Exit if accessed directly
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class for shortcode functionality
 */
class Readers_Haven_Shortcodes {

	/**
	 * Register all shortcodes
	 */
	public static function register() {
		add_shortcode( 'readers-haven', array( __CLASS__, 'home' ) );
		add_shortcode( 'readers_haven_home', array( __CLASS__, 'home' ) );
		add_shortcode( 'readers_haven_library', array( __CLASS__, 'library' ) );
		add_shortcode( 'readers_haven_add_book', array( __CLASS__, 'add_book' ) );
		add_shortcode( 'readers_haven_reading_log', array( __CLASS__, 'reading_log' ) );
		add_shortcode( 'readers_haven_book_details', array( __CLASS__, 'book_details' ) );
		add_shortcode( 'readers_haven_wishlist', array( __CLASS__, 'wishlist' ) );
		add_shortcode( 'readers_haven_favorites', array( __CLASS__, 'favorites' ) );
		add_shortcode( 'readers_haven_profile', array( __CLASS__, 'profile' ) );
		add_shortcode( 'readers_haven_achievements', array( __CLASS__, 'achievements' ) );
		add_shortcode( 'readers_haven_settings', array( __CLASS__, 'settings' ) );
	}

	/**
	 * Home shortcode
	 */
	public static function home() {
		return '<div id="readers-haven-app" class="readers-haven-container"></div>';
	}

	/**
	 * Library shortcode
	 */
	public static function library() {
		return '<h2>' . esc_html__( 'My Library', 'readers-haven' ) . '</h2>';
	}

	/**
	 * Add Book shortcode
	 */
	public static function add_book() {
		return '<h2>' . esc_html__( 'Add a Book', 'readers-haven' ) . '</h2>';
	}

	/**
	 * Reading Log shortcode
	 */
	public static function reading_log() {
		return '<h2>' . esc_html__( 'Reading Log', 'readers-haven' ) . '</h2>';
	}

	/**
	 * Book Details shortcode
	 */
	public static function book_details() {
		return '<h2>' . esc_html__( 'Book Details', 'readers-haven' ) . '</h2>';
	}

	/**
	 * Wishlist shortcode
	 */
	public static function wishlist() {
		return '<h2>' . esc_html__( 'Wishlist', 'readers-haven' ) . '</h2>';
	}

	/**
	 * Favorites shortcode
	 */
	public static function favorites() {
		return '<h2>' . esc_html__( 'Favorites', 'readers-haven' ) . '</h2>';
	}

	/**
	 * Profile shortcode
	 */
	public static function profile() {
		return '<h2>' . esc_html__( 'Profile', 'readers-haven' ) . '</h2>';
	}

	/**
	 * Achievements shortcode
	 */
	public static function achievements() {
		return '<h2>' . esc_html__( 'Achievements', 'readers-haven' ) . '</h2>';
	}

	/**
	 * Settings shortcode
	 */
	public static function settings() {
		return '<h2>' . esc_html__( 'Settings', 'readers-haven' ) . '</h2>';
	}
}
