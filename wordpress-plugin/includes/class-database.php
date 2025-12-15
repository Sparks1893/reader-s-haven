<?php
/**
 * Database setup and management
 *
 * @package ReadersHaven
 */

// Exit if accessed directly
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class for database functionality
 */
class Readers_Haven_Database {

	/**
	 * Create database tables on plugin activation
	 */
	public static function create_tables() {
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

	/**
	 * Drop tables on plugin deactivation (optional)
	 */
	public static function drop_tables() {
		// Uncomment to drop tables on deactivation
		// global $wpdb;
		// $table_name = $wpdb->prefix . 'rh_books';
		// $wpdb->query( "DROP TABLE IF EXISTS $table_name" );
	}
}
