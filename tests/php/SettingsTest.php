<?php

namespace ResumeVehicule\Tests;

use Brain\Monkey\Filters;
use Brain\Monkey\Functions;
use ResumeVehicule\Providers\ProviderRegistry;
use ResumeVehicule\Settings;

class SettingsTest extends TestCase {

	protected function setUp(): void {
		parent::setUp();
		Functions\when( 'esc_url_raw' )->returnArg();
		Functions\when( 'absint' )->alias(
			static function ( $value ) {
				return abs( (int) $value );
			}
		);
		Functions\when( 'sanitize_key' )->alias(
			static function ( $value ) {
				return preg_replace( '/[^a-z0-9_\-]/', '', strtolower( $value ) );
			}
		);
		Functions\when( 'untrailingslashit' )->alias(
			static function ( $value ) {
				return rtrim( $value, '/\\' );
			}
		);
	}

	public function test_all_merges_defaults(): void {
		Functions\when( 'get_option' )->justReturn( array( 'provider' => 'ademe' ) );

		$settings = new Settings();

		$this->assertSame( 'ademe', $settings->get( 'provider' ) );
		$this->assertSame( 43200, $settings->get( 'cache_ttl' ) );
		$this->assertNull( $settings->get( 'unknown' ) );
	}

	public function test_all_ignores_corrupted_option_and_is_filterable(): void {
		Functions\when( 'get_option' )->justReturn( 'corrupted' );
		Filters\expectApplied( 'resume_vehicule_settings' )
			->once()
			->andReturnUsing(
				static function ( array $values ) {
					$values['cache_ttl'] = 10;

					return $values;
				}
			);

		$values = ( new Settings() )->all();

		$this->assertSame( 'saabre', $values['provider'] );
		$this->assertSame( 10, $values['cache_ttl'] );
	}

	public function test_sanitize(): void {
		$values = ( new Settings() )->sanitize(
			array(
				'provider'   => 'ADEME<script>',
				'saabre_url' => ' https://api.test/ ',
				'cache_ttl'  => '9999999',
			)
		);

		$this->assertSame(
			array(
				'provider'   => 'ademescript',
				'saabre_url' => 'https://api.test',
				'cache_ttl'  => WEEK_IN_SECONDS,
			),
			$values
		);
	}

	public function test_sanitize_falls_back_to_defaults(): void {
		$this->assertSame( Settings::defaults(), ( new Settings() )->sanitize( 'invalid' ) );
	}

	public function test_register_hooks_admin_screens(): void {
		$settings = new Settings();
		$settings->register( $this->createMock( ProviderRegistry::class ) );

		$this->assertNotFalse( has_action( 'admin_init', array( $settings, 'register_setting' ) ) );
		$this->assertNotFalse( has_action( 'admin_menu', array( $settings, 'add_page' ) ) );
	}

	public function test_register_setting(): void {
		$settings = new Settings();

		Functions\expect( 'register_setting' )
			->once()
			->with( Settings::PAGE, Settings::OPTION, \Mockery::on( 'is_array' ) );

		$settings->register_setting();
	}

	public function test_add_page(): void {
		$settings = new Settings();

		Functions\expect( 'add_options_page' )
			->once()
			->with( \Mockery::any(), \Mockery::any(), 'manage_options', Settings::PAGE, array( $settings, 'render_page' ) );

		$settings->add_page();
	}

	public function test_render_page_lists_providers(): void {
		Functions\when( 'get_option' )->justReturn( array() );
		Functions\when( 'get_admin_page_title' )->justReturn( 'Résumé de véhicule' );
		Functions\when( 'settings_fields' )->justReturn( null );
		Functions\when( 'selected' )->alias(
			static function ( $a, $b ) {
				echo $a === $b ? ' selected' : '';
			}
		);
		Functions\when( 'submit_button' )->justReturn( null );

		$registry = $this->createMock( ProviderRegistry::class );
		$registry->method( 'labels' )->willReturn(
			array(
				'saabre' => 'Saabre',
				'ademe'  => 'ADEME',
			)
		);

		$settings = new Settings();
		$settings->register( $registry );

		ob_start();
		$settings->render_page();
		$html = (string) ob_get_clean();

		$this->assertStringContainsString( '<option value="saabre"  selected>Saabre</option>', $html );
		$this->assertStringContainsString( '<option value="ademe" >ADEME</option>', $html );
		$this->assertStringContainsString( 'value="https://saabre-fake-api.osc-fr1.scalingo.io"', $html );
	}
}
