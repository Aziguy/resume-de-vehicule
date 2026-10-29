<?php

namespace ResumeVehicule\Tests;

use ResumeVehicule\Providers\AdemeProvider;
use ResumeVehicule\Providers\HttpClient;

class AdemeProviderTest extends TestCase {

	/**
	 * Line as published in the ADEME Car Labelling CSV.
	 */
	private function line(): array {
		return array(
			'_id'                    => 'kangoo-130',
			'Marque'                 => 'RENAULT',
			'Libellé modèle'         => 'KANGOO',
			'Modèle'                 => 'KANGOO',
			'Description Commerciale' => 'KANGOO (130ch)',
			'Energie'                => 'ESSENCE',
			'Carrosserie'            => 'COMBISPACE',
			'Puissance maximale'     => '96,000',
			'Poids à vide'           => '1519',
			'Type de boite'          => 'AUTOMATIQUE',
			'CO2 vitesse mixte Min'  => '150,86',
			'CO2 vitesse mixte Max'  => '178,42',
			'Bonus-Malus'            => 'Malus',
			'Prix véhicule'          => '31000',
		);
	}

	public function test_identity(): void {
		$provider = new AdemeProvider( $this->createMock( HttpClient::class ) );

		$this->assertSame( 'ademe', $provider->id() );
		$this->assertNotEmpty( $provider->label() );
	}

	public function test_map_csv_headers(): void {
		$vehicle = ( new AdemeProvider( $this->createMock( HttpClient::class ) ) )->map( $this->line() );

		$this->assertSame( 'kangoo-130', $vehicle['id'] );
		$this->assertSame( 'ADEME Car Labelling', $vehicle['source'] );
		$this->assertSame( 'RENAULT', $vehicle['brand'] );
		$this->assertSame( 'KANGOO', $vehicle['model'] );
		$this->assertSame( 'KANGOO (130ch)', $vehicle['version'] );
		$this->assertSame( 'Essence', $vehicle['energy'] );
		$this->assertSame( 'Combispace', $vehicle['body'] );
		$this->assertSame( 'Automatique', $vehicle['gearbox'] );
		$this->assertSame( 131, $vehicle['power'] );
		$this->assertSame( 1519, $vehicle['weight'] );
		$this->assertSame( 178.0, $vehicle['co2'] );
		$this->assertSame( 'Malus', $vehicle['bonusMalus'] );
		$this->assertSame( 31000, $vehicle['price']['current'] );
		$this->assertTrue( $vehicle['commercialized'] );
	}

	public function test_map_data_fair_keys(): void {
		$vehicle = ( new AdemeProvider( $this->createMock( HttpClient::class ) ) )->map(
			array(
				'_id'           => 'mx30',
				'Marque'        => 'MAZDA',
				'Libelle_modele' => 'MX-30',
				'Prix_vehicule' => 38510,
				'_updatedAt'    => '2026-07-28T10:00:00.000Z',
			)
		);

		$this->assertSame( 'MX-30', $vehicle['model'] );
		$this->assertSame( 38510, $vehicle['price']['current'] );
		$this->assertNull( $vehicle['power'] );
		$this->assertNull( $vehicle['co2'] );
		$this->assertSame( '2026-07-28T10:00:00+00:00', $vehicle['updatedAt'] );
	}

	public function test_search(): void {
		$http = $this->createMock( HttpClient::class );
		$http->expects( $this->once() )
			->method( 'get_json' )
			->with(
				AdemeProvider::ENDPOINT,
				array(
					'size' => 5,
					'q'    => 'kangoo',
				)
			)
			->willReturn( array( 'results' => array( $this->line(), 'invalid' ) ) );

		$results = ( new AdemeProvider( $http ) )->search( ' kangoo ', 5 );

		$this->assertCount( 1, $results );
		$this->assertSame( 'kangoo-130', $results[0]['id'] );
	}

	public function test_search_without_term(): void {
		$http = $this->createMock( HttpClient::class );
		$http->expects( $this->once() )
			->method( 'get_json' )
			->with( AdemeProvider::ENDPOINT, array( 'size' => 1 ) )
			->willReturn( array() );

		$this->assertSame( array(), ( new AdemeProvider( $http ) )->search( '', 0 ) );
	}

	public function test_find(): void {
		$http = $this->createMock( HttpClient::class );
		$http->expects( $this->once() )
			->method( 'get_json' )
			->with(
				AdemeProvider::ENDPOINT,
				array(
					'size' => 1,
					'qs'   => '_id:"kangoo-130"',
				)
			)
			->willReturn( array( 'results' => array( $this->line() ) ) );

		$this->assertSame( 'RENAULT', ( new AdemeProvider( $http ) )->find( 'kangoo-"130' )['brand'] ?? null );
	}

	public function test_find_missing(): void {
		$http = $this->createMock( HttpClient::class );
		$http->method( 'get_json' )->willReturn( array( 'results' => array() ) );

		$this->assertNull( ( new AdemeProvider( $http ) )->find( 'nope' ) );
	}
}
