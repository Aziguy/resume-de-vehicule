<?php

namespace ResumeVehicule\Tests;

use Brain\Monkey\Filters;
use ResumeVehicule\Providers\AdemeProvider;
use ResumeVehicule\Providers\ProviderException;
use ResumeVehicule\Providers\ProviderInterface;
use ResumeVehicule\Providers\ProviderRegistry;
use ResumeVehicule\Providers\SaabreProvider;
use ResumeVehicule\Settings;

class ProviderRegistryTest extends TestCase {

	private function settings( string $provider ): Settings {
		$settings = $this->createMock( Settings::class );
		$settings->method( 'get' )->willReturnMap(
			array(
				array( 'provider', $provider ),
				array( 'saabre_url', 'https://saabre.test' ),
			)
		);

		return $settings;
	}

	public function test_registers_builtin_providers(): void {
		$registry = new ProviderRegistry( $this->settings( 'saabre' ) );

		$this->assertSame( array( 'saabre', 'ademe' ), array_keys( $registry->all() ) );
		$this->assertSame( array( 'saabre', 'ademe' ), array_keys( $registry->labels() ) );
	}

	public function test_active_provider_follows_settings(): void {
		$this->assertInstanceOf( AdemeProvider::class, ( new ProviderRegistry( $this->settings( 'ademe' ) ) )->active() );
	}

	public function test_unknown_provider_falls_back_to_first(): void {
		$this->assertInstanceOf( SaabreProvider::class, ( new ProviderRegistry( $this->settings( 'unknown' ) ) )->active() );
	}

	public function test_filter_adds_providers_and_drops_invalid_ones(): void {
		$custom = $this->createMock( ProviderInterface::class );
		$custom->method( 'id' )->willReturn( 'custom' );

		Filters\expectApplied( 'resume_vehicule_providers' )
			->once()
			->andReturnUsing(
				static function ( array $providers ) use ( $custom ) {
					$providers[] = $custom;
					$providers[] = 'not a provider';

					return $providers;
				}
			);

		$registry = new ProviderRegistry( $this->settings( 'custom' ) );

		$this->assertSame( $custom, $registry->active() );
		$this->assertCount( 3, $registry->all() );
	}

	public function test_throws_without_provider(): void {
		Filters\expectApplied( 'resume_vehicule_providers' )->andReturn( array() );

		$this->expectException( ProviderException::class );

		( new ProviderRegistry( $this->settings( 'saabre' ) ) )->active();
	}
}
