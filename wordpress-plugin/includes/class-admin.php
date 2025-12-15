<?php
/**
 * Admin functionality for the plugin
 *
 * @package ReadersHaven
 */

// Exit if accessed directly
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class for admin functionality
 */
class Readers_Haven_Admin {

	/**
	 * Add admin menu
	 */
	public static function add_admin_menu() {
		add_menu_page(
			__( "Reader's Haven", 'readers-haven' ),
			__( "Reader's Haven", 'readers-haven' ),
			'manage_options',
			'readers-haven',
			array( __CLASS__, 'render_admin_page' ),
			'dashicons-book'
		);
	}

	/**
	 * Render admin page
	 */
	public static function render_admin_page() {
		?>
		<div id="readers-haven-admin" class="readers-haven-admin-container"></div>
		<?php
	}
}
