<?php
/**
 * Provider registry.
 *
 * @package ResumeVehicule
 */

namespace ResumeVehicule\Providers;

use ResumeVehicule\Settings;

/**
 * Resolves the active provider, extensible through the "resume_vehicule_providers" filter.
 */
class ProviderRegistry {

	/**
	 * @var Settings
	 */
	private $settings;

	/**
	 * @var ProviderInterface[]|null
	 */
	private $providers;

	/**
	 * @param Settings $settings Plugin settings.
	 */
	public function __construct( Settings $settings ) {
		$this->settings = $settings;
	}

	/**
	 * Returns providers indexed by identifier.
	 *
	 * @return ProviderInterface[]
	 */
	public function all(): array {
		if ( null !== $this->providers ) {
			return $this->providers;
		}

		$http      = new HttpClient();
		$providers = array(
			new SaabreProvider( $http, (string) $this->settings->get( 'saabre_url' ) ),
			new AdemeProvider( $http ),
		);

		/**
		 * Filters the available vehicle data providers.
		 *
		 * @param ProviderInterface[] $providers Providers.
		 * @param Settings            $settings  Plugin settings.
		 */
		$providers = (array) apply_filters( 'resume_vehicule_providers', $providers, $this->settings );

		$this->providers = array();

		foreach ( $providers as $provider ) {
			if ( $provider instanceof ProviderInterface ) {
				$this->providers[ $provider->id() ] = $provider;
			}
		}

		return $this->providers;
	}

	/**
	 * Returns provider labels indexed by identifier.
	 *
	 * @return string[]
	 */
	public function labels(): array {
		return array_map(
			static function ( ProviderInterface $provider ) {
				return $provider->label();
			},
			$this->all()
		);
	}

	/**
	 * Returns the configured provider, falling back to the first one.
	 *
	 * @return ProviderInterface
	 * @throws ProviderException When no provider is registered.
	 */
	public function active(): ProviderInterface {
		$providers = $this->all();
		$id        = (string) $this->settings->get( 'provider' );

		if ( isset( $providers[ $id ] ) ) {
			return $providers[ $id ];
		}

		$first = reset( $providers );

		if ( ! $first ) {
			throw new ProviderException( 'No vehicle provider registered.' );
		}

		return $first;
	}
}
