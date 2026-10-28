<?php

namespace ResumeVehicule\Tests;

use Brain\Monkey\Functions;
use ResumeVehicule\Providers\HttpClient;
use ResumeVehicule\Providers\ProviderException;

class HttpClientTest extends TestCase {

	protected function setUp(): void {
		parent::setUp();
		Functions\when( 'is_wp_error' )->alias(
			static function ( $value ) {
				return $value instanceof \WP_Error;
			}
		);
		Functions\when( 'wp_remote_retrieve_response_code' )->alias(
			static function ( $response ) {
				return $response['response']['code'];
			}
		);
		Functions\when( 'wp_remote_retrieve_body' )->alias(
			static function ( $response ) {
				return $response['body'];
			}
		);
	}

	private function respond( int $code, string $body ): void {
		Functions\when( 'wp_remote_get' )->justReturn(
			array(
				'response' => array( 'code' => $code ),
				'body'     => $body,
			)
		);
	}

	public function test_decodes_json_and_appends_query(): void {
		Functions\expect( 'wp_remote_get' )
			->once()
			->with( 'https://api.test/cars?size=5&q=clio%20rs', \Mockery::type( 'array' ) )
			->andReturn(
				array(
					'response' => array( 'code' => 200 ),
					'body'     => '{"data":[1]}',
				)
			);

		$data = ( new HttpClient() )->get_json(
			'https://api.test/cars',
			array(
				'size' => 5,
				'q'    => 'clio rs',
			)
		);

		$this->assertSame( array( 'data' => array( 1 ) ), $data );
	}

	public function test_appends_query_to_existing_query_string(): void {
		Functions\expect( 'wp_remote_get' )
			->once()
			->with( 'https://api.test/cars?a=1&b=2', \Mockery::type( 'array' ) )
			->andReturn(
				array(
					'response' => array( 'code' => 200 ),
					'body'     => '[]',
				)
			);

		$this->assertSame( array(), ( new HttpClient() )->get_json( 'https://api.test/cars?a=1', array( 'b' => 2 ) ) );
	}

	public function test_returns_empty_array_on_404(): void {
		$this->respond( 404, 'Not found' );

		$this->assertSame( array(), ( new HttpClient() )->get_json( 'https://api.test' ) );
	}

	public function test_throws_on_server_error(): void {
		$this->respond( 503, '' );

		$this->expectException( ProviderException::class );
		$this->expectExceptionMessage( 'Unexpected HTTP status 503.' );

		( new HttpClient() )->get_json( 'https://api.test' );
	}

	public function test_throws_on_invalid_json(): void {
		$this->respond( 200, '<html>' );

		$this->expectException( ProviderException::class );

		( new HttpClient() )->get_json( 'https://api.test' );
	}

	public function test_throws_on_transport_error(): void {
		Functions\when( 'wp_remote_get' )->justReturn( new \WP_Error( 'http', 'Could not resolve host' ) );

		$this->expectException( ProviderException::class );
		$this->expectExceptionMessage( 'Could not resolve host' );

		( new HttpClient() )->get_json( 'https://api.test' );
	}
}
