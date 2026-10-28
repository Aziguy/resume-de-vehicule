<?php

namespace ResumeVehicule\Tests;

use ResumeVehicule\Vehicle;

class VehicleTest extends TestCase {

	public function test_normalize_fills_missing_values_with_null(): void {
		$vehicle = Vehicle::normalize( array() );

		$this->assertSame( '', $vehicle['id'] );
		$this->assertNull( $vehicle['brand'] );
		$this->assertNull( $vehicle['commercialized'] );
		$this->assertSame( array( 'length' => null, 'width' => null, 'height' => null ), $vehicle['dimensions'] );
		$this->assertSame( array( 'base' => null, 'current' => null ), $vehicle['price'] );
	}

	public function test_normalize_casts_values(): void {
		$vehicle = Vehicle::normalize(
			array(
				'id'             => 42,
				'brand'          => '  Renault ',
				'model'          => '',
				'maxSpeed'       => '180',
				'dimensions'     => array( 'length' => '4050' ),
				'price'          => array( 'current' => '18 900' ),
				'commercialized' => 1,
				'image'          => 'javascript:alert(1)',
				'updatedAt'      => '2024-04-01',
			)
		);

		$this->assertSame( '42', $vehicle['id'] );
		$this->assertSame( 'Renault', $vehicle['brand'] );
		$this->assertNull( $vehicle['model'] );
		$this->assertSame( 180, $vehicle['maxSpeed'] );
		$this->assertSame( 4050, $vehicle['dimensions']['length'] );
		$this->assertSame( 18900, $vehicle['price']['current'] );
		$this->assertTrue( $vehicle['commercialized'] );
		$this->assertNull( $vehicle['image'] );
		$this->assertSame( '2024-04-01T00:00:00+00:00', $vehicle['updatedAt'] );
	}

	public function test_normalize_rejects_invalid_dates_and_keeps_http_images(): void {
		$vehicle = Vehicle::normalize(
			array(
				'image'     => 'https://example.com/car.png',
				'updatedAt' => 'not a date',
			)
		);

		$this->assertSame( 'https://example.com/car.png', $vehicle['image'] );
		$this->assertNull( $vehicle['updatedAt'] );
	}

	/**
	 * @dataProvider numbers
	 */
	public function test_number( $input, $expected ): void {
		$this->assertSame( $expected, Vehicle::number( $input ) );
	}

	public function numbers(): array {
		return array(
			'int'           => array( 12, 12 ),
			'float'         => array( 1.5, 1.5 ),
			'french string' => array( '96,000', 96.0 ),
			'spaced'        => array( '1 519', 1519 ),
			'empty'         => array( '', null ),
			'text'          => array( 'n/a', null ),
			'array'         => array( array( 1 ), null ),
			'null'          => array( null, null ),
		);
	}
}
