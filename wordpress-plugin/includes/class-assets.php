<?php
/**
 * Assets enqueuing functionality
 *
 * @package ReadersHaven
 */

// Exit if accessed directly
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class for managing plugin assets
 */
class Readers_Haven_Assets {

	/**
	 * Enqueue frontend assets
	 */
	public static function enqueue_frontend_assets() {
		// Only enqueue on pages with the shortcode
		if ( ! has_shortcode( get_the_content(), 'readers-haven' ) ) {
			return;
		}

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
				'ajax_url'           => admin_url( 'admin-ajax.php' ),
				'rest_url'           => rest_url( 'readers-haven/v1' ),
				'nonce'              => wp_create_nonce( 'readers-haven-nonce' ),
				'current_user_id'    => get_current_user_id(),
				'is_user_logged_in'  => is_user_logged_in(),
			)
		);
	}

	/**
	 * Enqueue admin assets
	 */
	public static function enqueue_admin_assets( $hook ) {
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

		wp_localize_script(
			'readers-haven-admin',
			'readersHavenData',
			array(
				'ajax_url'           => admin_url( 'admin-ajax.php' ),
				'rest_url'           => rest_url( 'readers-haven/v1' ),
				'nonce'              => wp_create_nonce( 'readers-haven-nonce' ),
				'current_user_id'    => get_current_user_id(),
				'is_user_logged_in'  => is_user_logged_in(),
			)
		);
	}
}
