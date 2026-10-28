<?php
/**
 * JSON HTTP client.
 *
 * @package ResumeVehicule
 */

namespace ResumeVehicule\Providers;

/**
 * Thin wrapper around the WordPress HTTP API.
 */
class HttpClient {

	/**
	 * Performs a GET request and decodes the JSON body.
	 *
	 * @param string $url   Endpoint.
	 * @param array  $query Query arguments.
	 * @return array
	 * @throws ProviderException On transport, status or decoding error.
	 */
	public function get_json( string $url, array $query = array() ): array {
		if ( $query ) {
			$url .= ( false === strpos( $url, '?' ) ? '?' : '&' ) . http_build_query( $query, '', '&', PHP_QUERY_RFC3986 );
		}

		$response = wp_remote_get(
			$url,
			array(
				'timeout' => 10,
				'headers' => array( 'Accept' => 'application/json' ),
			)
		);

		if ( is_wp_error( $response ) ) {
			throw new ProviderException( $response->get_error_message() );
		}

		$status = (int) wp_remote_retrieve_response_code( $response );

		if ( 404 === $status ) {
			return array();
		}

		if ( $status < 200 || $status >= 300 ) {
			throw new ProviderException( sprintf( 'Unexpected HTTP status %d.', $status ) );
		}

		$data = json_decode( (string) wp_remote_retrieve_body( $response ), true );

		if ( ! is_array( $data ) ) {
			throw new ProviderException( 'Invalid JSON response.' );
		}

		return $data;
	}
}
