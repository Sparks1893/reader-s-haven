<?php
/**
 * REST API endpoints for books
 *
 * @package ReadersHaven
 */

// Exit if accessed directly
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class for REST API functionality
 */
class Readers_Haven_API {

	/**
	 * Register REST API endpoints
	 */
	public static function register_endpoints() {
		// Books endpoint
		register_rest_route(
			'readers-haven/v1',
			'/books',
			array(
				array(
					'methods'             => 'GET',
					'callback'            => array( __CLASS__, 'get_books' ),
					'permission_callback' => '__return_true',
				),
				array(
					'methods'             => 'POST',
					'callback'            => array( __CLASS__, 'create_book' ),
					'permission_callback' => array( __CLASS__, 'check_user_permission' ),
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
					'callback'            => array( __CLASS__, 'get_book' ),
					'permission_callback' => '__return_true',
				),
				array(
					'methods'             => 'PUT',
					'callback'            => array( __CLASS__, 'update_book' ),
					'permission_callback' => array( __CLASS__, 'check_user_permission' ),
				),
				array(
					'methods'             => 'DELETE',
					'callback'            => array( __CLASS__, 'delete_book' ),
					'permission_callback' => array( __CLASS__, 'check_user_permission' ),
				),
			)
		);
	}

	/**
	 * Check user permission
	 */
	public static function check_user_permission() {
		return is_user_logged_in();
	}

	/**
	 * Get books
	 */
	public static function get_books( $request ) {
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
	public static function get_book( $request ) {
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
	public static function create_book( $request ) {
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
	public static function update_book( $request ) {
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
	public static function delete_book( $request ) {
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
}
