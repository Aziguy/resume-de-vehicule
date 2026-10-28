<?php

namespace ResumeVehicule\Tests;

use Brain\Monkey\Functions;
use ResumeVehicule\Providers\ProviderException;
use ResumeVehicule\RestController;
use ResumeVehicule\VehicleRepository;

class RestControllerTest extends TestCase {

	/**
	 * @var VehicleRepository|\PHPUnit\Framework\MockObject\MockObject
	 */
	private $repository;

	/**
	 * @var RestController
	 */
	private $controller;

	protected function setUp(): void {
		parent::setUp();
		$this->repository = $this->createMock( VehicleRepository::class );
		$this->controller = new RestController( $this->repository );
	}

	public function test_registers_routes(): void {
		Functions\expect( 'register_rest_route' )
			->once()
			->with( 'resume-vehicule/v1', '/vehicles', \Mockery::type( 'array' ) );
		Functions\expect( 'register_rest_route' )
			->once()
			->with( 'resume-vehicule/v1', '/vehicles/(?P<id>[\w\-]+)', \Mockery::type( 'array' ) );

		$this->controller->register_routes();
	}

	public function test_requires_edit_posts_capability(): void {
		Functions\expect( 'current_user_can' )->once()->with( 'edit_posts' )->andReturn( false );

		$this->assertFalse( $this->controller->can_read() );
	}

	public function test_get_items(): void {
		$this->repository->expects( $this->once() )->method( 'search' )->with( 'clio', 5 )->willReturn( array( array( 'id' => 'a' ) ) );

		$response = $this->controller->get_items(
			new \WP_REST_Request(
				array(
					'search'   => 'clio',
					'per_page' => 5,
				)
			)
		);

		$this->assertSame( array( array( 'id' => 'a' ) ), $response->get_data() );
	}

	public function test_get_items_reports_provider_failure(): void {
		$this->repository->method( 'search' )->willThrowException( new ProviderException( 'timeout' ) );

		$error = $this->controller->get_items( new \WP_REST_Request( array() ) );

		$this->assertInstanceOf( \WP_Error::class, $error );
		$this->assertSame( 'rv_provider_error', $error->code );
		$this->assertSame( 502, $error->data['status'] );
		$this->assertSame( 'timeout', $error->data['detail'] );
	}

	public function test_get_item(): void {
		$this->repository->method( 'find' )->with( 'a' )->willReturn( array( 'id' => 'a' ) );

		$this->assertSame( array( 'id' => 'a' ), $this->controller->get_item( new \WP_REST_Request( array( 'id' => 'a' ) ) )->get_data() );
	}

	public function test_get_item_not_found(): void {
		$this->repository->method( 'find' )->willReturn( null );

		$error = $this->controller->get_item( new \WP_REST_Request( array( 'id' => 'a' ) ) );

		$this->assertSame( 404, $error->data['status'] );
	}

	public function test_get_item_reports_provider_failure(): void {
		$this->repository->method( 'find' )->willThrowException( new ProviderException( 'down' ) );

		$this->assertSame( 502, $this->controller->get_item( new \WP_REST_Request( array( 'id' => 'a' ) ) )->data['status'] );
	}
}
