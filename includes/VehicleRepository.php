<?php
/**
 * Cached access to the active provider.
 *
 * @package ResumeVehicule
 */

namespace ResumeVehicule;

use ResumeVehicule\Providers\ProviderException;
use ResumeVehicule\Providers\ProviderRegistry;

/**
 * Caches provider responses in transients.
 */
class VehicleRepository {

	const CACHE_PREFIX = 'rv_';

	/**
	 * @var ProviderRegistry
	 */
	private $registry;

	/**
	 * @var Settings
	 */
	private $settings;

	/**
	 * @param ProviderRegistry $registry Providers.
	 * @param Settings         $settings Plugin settings.
	 */
	public function __construct( ProviderRegistry $registry, Settings $settings ) {
		$this->registry = $registry;
		$this->settings = $settings;
	}

	/**
	 * @param string $term  Search term.
	 * @param int    $limit Maximum results.
	 * @return array[]
	 * @throws ProviderException On provider failure.
	 */
	public function search( string $term, int $limit ): array {
		$provider = $this->registry->active();

		return $this->remember(
			array( $provider->id(), 'search', $term, $limit ),
			static function () use ( $provider, $term, $limit ) {
				return $provider->search( $term, $limit );
			}
		);
	}

	/**
	 * @param string $id Vehicle identifier.
	 * @return array|null
	 * @throws ProviderException On provider failure.
	 */
	public function find( string $id ): ?array {
		$provider = $this->registry->active();
		$vehicle  = $this->remember(
			array( $provider->id(), 'find', $id ),
			static function () use ( $provider, $id ) {
				return $provider->find( $id ) ?? array();
			}
		);

		return $vehicle ? $vehicle : null;
	}

	/**
	 * Returns the cached value or stores the callback result.
	 *
	 * @param array    $key      Cache key parts.
	 * @param callable $callback Producer.
	 * @return array
	 */
	private function remember( array $key, callable $callback ): array {
		$ttl = (int) $this->settings->get( 'cache_ttl' );

		if ( $ttl <= 0 ) {
			return $callback();
		}

		$cache_key = self::CACHE_PREFIX . md5( (string) wp_json_encode( $key ) );
		$cached    = get_transient( $cache_key );

		if ( is_array( $cached ) ) {
			return $cached;
		}

		$value = $callback();
		set_transient( $cache_key, $value, $ttl );

		return $value;
	}
}
