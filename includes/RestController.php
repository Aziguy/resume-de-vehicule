<?php
/**
 * REST proxy used by the editor.
 *
 * @package ResumeVehicule
 */

namespace ResumeVehicule;

use ResumeVehicule\Providers\ProviderException;
use WP_Error;
use WP_REST_Request;
use WP_REST_Response;
use WP_REST_Server;

/**
 * Exposes /resume-vehicule/v1/vehicles so the browser never calls third party APIs directly.
 */
class RestController {

	const NAMESPACE = 'resume-vehicule/v1';

	/**
	 * @var VehicleRepository
	 */
	private $repository;

	/**
	 * @param VehicleRepository $repository Vehicle source.
	 */
	public function __construct( VehicleRepository $repository ) {
		$this->repository = $repository;
	}

	/**
	 * Registers routes.
	 */
	public function register_routes(): void {
		register_rest_route(
			self::NAMESPACE,
			'/vehicles',
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( $this, 'get_items' ),
				'permission_callback' => array( $this, 'can_read' ),
				'args'                => array(
					'search'   => array(
						'type'              => 'string',
						'default'           => '',
						'sanitize_callback' => 'sanitize_text_field',
					),
					'per_page' => array(
						'type'    => 'integer',
						'default' => 20,
						'minimum' => 1,
						'maximum' => 100,
					),
				),
			)
		);

		register_rest_route(
			self::NAMESPACE,
			'/vehicles/(?P<id>[\w\-]+)',
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( $this, 'get_item' ),
				'permission_callback' => array( $this, 'can_read' ),
			)
		);
	}

	/**
	 * Only content editors may query the proxy.
	 */
	public function can_read(): bool {
		return current_user_can( 'edit_posts' );
	}

	/**
	 * @param WP_REST_Request $request Request.
	 * @return WP_REST_Response|WP_Error
	 */
	public function get_items( WP_REST_Request $request ) {
		try {
			$items = $this->repository->search( (string) $request['search'], (int) $request['per_page'] );
		} catch ( ProviderException $e ) {
			return $this->error( $e );
		}

		return new WP_REST_Response( $items );
	}

	/**
	 * @param WP_REST_Request $request Request.
	 * @return WP_REST_Response|WP_Error
	 */
	public function get_item( WP_REST_Request $request ) {
		try {
			$item = $this->repository->find( (string) $request['id'] );
		} catch ( ProviderException $e ) {
			return $this->error( $e );
		}

		if ( null === $item ) {
			return new WP_Error( 'rv_not_found', __( 'Véhicule introuvable.', 'resume-vehicule-block' ), array( 'status' => 404 ) );
		}

		return new WP_REST_Response( $item );
	}

	/**
	 * @param ProviderException $e Provider failure.
	 * @return WP_Error
	 */
	private function error( ProviderException $e ): WP_Error {
		return new WP_Error(
			'rv_provider_error',
			__( 'La source de données est indisponible.', 'resume-vehicule-block' ),
			array(
				'status' => 502,
				'detail' => $e->getMessage(),
			)
		);
	}
}
