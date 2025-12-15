<?php
if ( ! defined( 'ABSPATH' ) ) { exit; }

class Readers_Haven_Pages {

	public static function get_pages(): array {
		return [
			'readers-haven' => [
				'title' => 'Reader’s Haven',
				'content' => '[readers_haven_dashboard]',
			],
			'my-library' => [
				'title' => 'My Library',
				'content' => '[readers_haven_library]',
			],
			'add-a-book' => [
				'title' => 'Add a Book',
				'content' => '[readers_haven_add_book]',
			],
			'reading-log' => [
				'title' => 'Reading Log',
				'content' => '[readers_haven_reading_log]',
			],
			'book-details' => [
				'title' => 'Book Details',
				'content' => '[readers_haven_book_details]',
			],
			'wishlist' => [
				'title' => 'Wishlist',
				'content' => '[readers_haven_wishlist]',
			],
			'favorites' => [
				'title' => 'Favorites',
				'content' => '[readers_haven_favorites]',
			],
			'profile' => [
				'title' => 'Profile',
				'content' => '[readers_haven_profile]',
			],
			'achievements' => [
				'title' => 'Achievements',
				'content' => '[readers_haven_achievements]',
			],
			'settings' => [
				'title' => 'Settings',
				'content' => '[readers_haven_settings]',
			],
		];
	}

	public static function create_pages(): void {
		$stored = get_option( 'readers_haven_pages', [] );

		foreach ( self::get_pages() as $slug => $page ) {

			// Already created and exists
			if ( isset( $stored[ $slug ] ) && get_post_status( $stored[ $slug ] ) ) {
				continue;
			}

			// Page already exists by slug
			$existing = get_page_by_path( $slug );
			if ( $existing ) {
				$stored[ $slug ] = $existing->ID;
				continue;
			}

			$page_id = wp_insert_post( [
				'post_type'    => 'page',
				'post_title'   => $page['title'],
				'post_name'    => $slug,
				'post_status'  => 'publish',
				'post_content' => $page['content'],
			] );

			if ( ! is_wp_error( $page_id ) ) {
				$stored[ $slug ] = $page_id;
			}
		}

		update_option( 'readers_haven_pages', $stored );
	}
}
