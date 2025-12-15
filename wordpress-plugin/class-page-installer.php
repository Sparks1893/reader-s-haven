<?php
// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) { exit; }

class ReadersHaven_Page_Installer {

	/**
	 * Define every page your plugin needs.
	 * slug => [title, shortcode]
	 */
	public static function pages(): array {
		return [
			'readers-haven'        => [ 'Reader’s Haven',        '[readers_haven_home]' ],
			'my-library'           => [ 'My Library',            '[readers_haven_library]' ],
			'add-a-book'           => [ 'Add a Book',            '[readers_haven_add_book]' ],
			'reading-log'          => [ 'Reading Log',           '[readers_haven_reading_log]' ],
			'book-details'         => [ 'Book Details',          '[readers_haven_book_details]' ],
			'wishlist'             => [ 'Wishlist',              '[readers_haven_wishlist]' ],
			'favorites'            => [ 'Favorites',             '[readers_haven_favorites]' ],
			'profile'              => [ 'Profile',               '[readers_haven_profile]' ],
			'achievements'         => [ 'Achievements',          '[readers_haven_achievements]' ],
			'settings'             => [ 'Settings',              '[readers_haven_settings]' ],
		];
	}

	/**
	 * Create missing pages (safe to run multiple times).
	 */
	public static function install(): void {
		if ( ! function_exists( 'wp_insert_post' ) ) { return; }

		$created = get_option( 'readers_haven_pages', [] );
		if ( ! is_array( $created ) ) { $created = []; }

		foreach ( self::pages() as $slug => $data ) {
			[ $title, $shortcode ] = $data;

			// If we already stored an ID and it still exists, skip.
			if ( ! empty( $created[ $slug ] ) && get_post_status( (int) $created[ $slug ] ) ) {
				continue;
			}

			// If a page with this slug already exists, store it and skip.
			$existing = get_page_by_path( $slug, OBJECT, 'page' );
			if ( $existing instanceof WP_Post ) {
				$created[ $slug ] = (int) $existing->ID;
				continue;
			}

			$page_id = wp_insert_post( [
				'post_type'    => 'page',
				'post_status'  => 'publish',
				'post_title'   => $title,
				'post_name'    => $slug,
				'post_content' => $shortcode,
			], true );

			if ( ! is_wp_error( $page_id ) ) {
				$created[ $slug ] = (int) $page_id;
			}
		}

		update_option( 'readers_haven_pages', $created, false );
	}

	/**
	 * Optional: remove pages on uninstall (not activation deactivation).
	 * Keep OFF by default unless you want this behavior.
	 */
	public static function uninstall(): void {
		$created = get_option( 'readers_haven_pages', [] );
		if ( ! is_array( $created ) ) { return; }

		foreach ( $created as $id ) {
			$id = (int) $id;
			if ( $id && get_post_status( $id ) ) {
				wp_delete_post( $id, true );
			}
		}
		delete_option( 'readers_haven_pages' );
	}
}

