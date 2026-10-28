<?php
/**
 * Saabre fake API provider.
 *
 * @package ResumeVehicule
 */

namespace ResumeVehicule\Providers;

use ResumeVehicule\Vehicle;

/**
 * Historical source: GET /cars/ and GET /cars/{id}, payload wrapped in "data".
 */
class SaabreProvider implements ProviderInterface {

	/**
	 * @var HttpClient
	 */
	private $http;

	/**
	 * @var string
	 */
	private $base_url;

	/**
	 * @param HttpClient $http     HTTP client.
	 * @param string     $base_url API root, without trailing slash.
	 */
	public function __construct( HttpClient $http, string $base_url ) {
		$this->http     = $http;
		$this->base_url = rtrim( $base_url, '/' );
	}

	public function id(): string {
		return 'saabre';
	}

	public function label(): string {
		return __( 'Saabre (API historique)', 'resume-vehicule-block' );
	}

	public function search( string $term, int $limit ): array {
		$body  = $this->http->get_json( $this->base_url . '/cars/' );
		$items = isset( $body['data'] ) && is_array( $body['data'] ) ? $body['data'] : array();
		$term  = strtolower( trim( $term ) );
		$found = array();

		foreach ( $items as $item ) {
			if ( ! is_array( $item ) ) {
				continue;
			}

			$vehicle = $this->map( $item );
			$label   = strtolower( $vehicle['brand'] . ' ' . $vehicle['model'] );

			if ( '' === $term || false !== strpos( $label, $term ) ) {
				$found[] = $vehicle;
			}

			if ( count( $found ) >= $limit ) {
				break;
			}
		}

		return $found;
	}

	public function find( string $id ): ?array {
		$body = $this->http->get_json( $this->base_url . '/cars/' . rawurlencode( $id ) );
		$item = isset( $body['data'] ) && is_array( $body['data'] ) ? $body['data'] : null;

		return $item ? $this->map( $item ) : null;
	}

	/**
	 * Maps a Saabre car to the normalized shape.
	 *
	 * @param array $item Raw car.
	 * @return array
	 */
	public function map( array $item ): array {
		$pricing = isset( $item['pricing'] ) && is_array( $item['pricing'] ) ? $item['pricing'] : array();
		$dates   = isset( $item['commercializationDates'] ) && is_array( $item['commercializationDates'] ) ? $item['commercializationDates'] : null;

		return Vehicle::normalize(
			array(
				'id'             => $item['id'] ?? '',
				'source'         => 'Saabre',
				'brand'          => $item['brand'] ?? null,
				'model'          => $item['model'] ?? null,
				'energy'         => $item['energySource'] ?? null,
				'maxSpeed'       => $item['maxSpeed'] ?? null,
				'dimensions'     => $item['dimensions'] ?? array(),
				'price'          => array(
					'base'    => $pricing['basePrice'] ?? null,
					'current' => $pricing['currentPrice'] ?? null,
				),
				'commercialized' => null === $dates ? null : empty( $dates['end'] ),
				'image'          => $item['image'] ?? $item['imageUrl'] ?? $item['picture'] ?? null,
				'updatedAt'      => $item['lastUpdated'] ?? null,
			)
		);
	}
}
