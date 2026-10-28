<?php

namespace ResumeVehicule\Tests;

use ResumeVehicule\Providers\HttpClient;
use ResumeVehicule\Providers\SaabreProvider;

class SaabreProviderTest extends TestCase {

	private function car( array $overrides = array() ): array {
		return array_merge(
			array(
				'id'                     => '9d8d69a6',
				'brand'                  => 'Renault',
				'model'                  => 'Clio',
				'energySource'           => 'Essence',
				'maxSpeed'               => 180,
				'dimensions'             => array(
					'length' => 4050,
					'width'  => 1798,
					'height' => 1440,
				),
				'pricing'                => array(
					'basePrice'    => '19500',
					'currentPrice' => '18900',
				),
				'commercializationDates' => array(
					'start' => '2019-06-01',
					'end'   => null,
				),
				'lastUpdated'            => '2024-04-01T00:00:00Z',
			),
			$overrides
		);
	}

	private function provider( array $body, string $url = 'https://saabre.test/cars/' ): SaabreProvider {
		$http = $this->createMock( HttpClient::class );
		$http->expects( $this->once() )->method( 'get_json' )->with( $url )->willReturn( $body );

		return new SaabreProvider( $http, 'https://saabre.test/' );
	}

	public function test_identity(): void {
		$provider = new SaabreProvider( $this->createMock( HttpClient::class ), 'https://saabre.test' );

		$this->assertSame( 'saabre', $provider->id() );
		$this->assertNotEmpty( $provider->label() );
	}

	public function test_map(): void {
		$provider = new SaabreProvider( $this->createMock( HttpClient::class ), 'https://saabre.test' );
		$vehicle  = $provider->map( $this->car() );

		$this->assertSame( '9d8d69a6', $vehicle['id'] );
		$this->assertSame( 'Saabre', $vehicle['source'] );
		$this->assertSame( 'Essence', $vehicle['energy'] );
		$this->assertSame( array( 'base' => 19500, 'current' => 18900 ), $vehicle['price'] );
		$this->assertSame( 1798, $vehicle['dimensions']['width'] );
		$this->assertTrue( $vehicle['commercialized'] );
		$this->assertSame( '2024-04-01T00:00:00+00:00', $vehicle['updatedAt'] );
	}

	public function test_map_handles_ended_and_unknown_commercialization(): void {
		$provider = new SaabreProvider( $this->createMock( HttpClient::class ), 'https://saabre.test' );

		$ended   = $provider->map( $this->car( array( 'commercializationDates' => array( 'end' => '2023-01-01' ) ) ) );
		$unknown = $provider->map( array( 'id' => 1 ) );

		$this->assertFalse( $ended['commercialized'] );
		$this->assertNull( $unknown['commercialized'] );
	}

	public function test_search_filters_and_limits(): void {
		$body = array(
			'data' => array(
				$this->car(),
				$this->car( array( 'id' => 'b', 'model' => 'Captur' ) ),
				'invalid',
				$this->car( array( 'id' => 'c', 'brand' => 'Peugeot', 'model' => '208' ) ),
			),
		);

		$this->assertSame( array( '9d8d69a6' ), array_column( $this->provider( $body )->search( 'CLIO', 10 ), 'id' ) );
		$this->assertSame( array( '9d8d69a6', 'b' ), array_column( $this->provider( $body )->search( '', 2 ), 'id' ) );
	}

	public function test_search_without_data(): void {
		$this->assertSame( array(), $this->provider( array() )->search( '', 10 ) );
	}

	public function test_find(): void {
		$vehicle = $this->provider( array( 'data' => $this->car() ), 'https://saabre.test/cars/9d8d69a6' )->find( '9d8d69a6' );

		$this->assertSame( 'Clio', $vehicle['model'] );
	}

	public function test_find_missing(): void {
		$this->assertNull( $this->provider( array(), 'https://saabre.test/cars/x%2Fy' )->find( 'x/y' ) );
	}
}
