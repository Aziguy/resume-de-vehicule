<?php

namespace ResumeVehicule\Tests;

use Brain\Monkey\Functions;
use ResumeVehicule\Providers\ProviderInterface;
use ResumeVehicule\Providers\ProviderRegistry;
use ResumeVehicule\Settings;
use ResumeVehicule\VehicleRepository;

class VehicleRepositoryTest extends TestCase {

	/**
	 * @var ProviderInterface|\PHPUnit\Framework\MockObject\MockObject
	 */
	private $provider;

	protected function setUp(): void {
		parent::setUp();
		Functions\when( 'wp_json_encode' )->alias( 'json_encode' );

		$this->provider = $this->createMock( ProviderInterface::class );
		$this->provider->method( 'id' )->willReturn( 'fake' );
	}

	private function repository( int $ttl ): VehicleRepository {
		$registry = $this->createMock( ProviderRegistry::class );
		$registry->method( 'active' )->willReturn( $this->provider );

		$settings = $this->createMock( Settings::class );
		$settings->method( 'get' )->with( 'cache_ttl' )->willReturn( $ttl );

		return new VehicleRepository( $registry, $settings );
	}

	public function test_search_returns_cached_value(): void {
		Functions\when( 'get_transient' )->justReturn( array( array( 'id' => 'cached' ) ) );
		Functions\expect( 'set_transient' )->never();
		$this->provider->expects( $this->never() )->method( 'search' );

		$this->assertSame( array( array( 'id' => 'cached' ) ), $this->repository( 60 )->search( 'clio', 5 ) );
	}

	public function test_search_stores_fresh_value(): void {
		Functions\when( 'get_transient' )->justReturn( false );
		Functions\expect( 'set_transient' )
			->once()
			->with( \Mockery::pattern( '/^rv_[a-f0-9]{32}$/' ), array( array( 'id' => 'a' ) ), 60 );
		$this->provider->expects( $this->once() )->method( 'search' )->with( 'clio', 5 )->willReturn( array( array( 'id' => 'a' ) ) );

		$this->assertSame( array( array( 'id' => 'a' ) ), $this->repository( 60 )->search( 'clio', 5 ) );
	}

	public function test_cache_can_be_disabled(): void {
		Functions\expect( 'get_transient' )->never();
		$this->provider->expects( $this->once() )->method( 'find' )->with( 'a' )->willReturn( array( 'id' => 'a' ) );

		$this->assertSame( array( 'id' => 'a' ), $this->repository( 0 )->find( 'a' ) );
	}

	public function test_find_returns_null_for_missing_vehicle(): void {
		Functions\when( 'get_transient' )->justReturn( false );
		Functions\when( 'set_transient' )->justReturn( true );
		$this->provider->method( 'find' )->willReturn( null );

		$this->assertNull( $this->repository( 60 )->find( 'missing' ) );
	}
}
