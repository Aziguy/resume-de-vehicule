<?php
/**
 * Plugin bootstrap.
 *
 * @package ResumeVehicule
 */

namespace ResumeVehicule;

use ResumeVehicule\Providers\ProviderRegistry;

/**
 * Wires every component to WordPress hooks.
 */
final class Plugin {

	const BLOCK_CATEGORY = 'brakson-category';

	/**
	 * Absolute plugin directory.
	 *
	 * @var string
	 */
	private $dir;

	/**
	 * @param string $dir Absolute plugin directory.
	 */
	public function __construct( string $dir ) {
		$this->dir = rtrim( $dir, '/' );
	}

	/**
	 * Registers hooks.
	 */
	public function register(): void {
		$settings   = new Settings();
		$registry   = new ProviderRegistry( $settings );
		$repository = new VehicleRepository( $registry, $settings );

		add_action( 'init', array( $this, 'register_block' ) );
		add_filter( 'block_categories_all', array( $this, 'register_block_category' ) );
		add_action( 'rest_api_init', array( new RestController( $repository ), 'register_routes' ) );

		$settings->register( $registry );

		add_filter( 'plugin_action_links_' . plugin_basename( PLUGIN_FILE ), array( $this, 'action_links' ) );
	}

	/**
	 * Adds a settings shortcut on the plugins screen.
	 *
	 * @param array $links Action links.
	 * @return array
	 */
	public function action_links( array $links ): array {
		array_unshift(
			$links,
			sprintf(
				'<a href="%s">%s</a>',
				esc_url( admin_url( 'options-general.php?page=' . Settings::PAGE ) ),
				esc_html__( 'Réglages', 'resume-vehicule-block' )
			)
		);

		return $links;
	}

	/**
	 * Registers the block from its compiled metadata.
	 */
	public function register_block(): void {
		$block = register_block_type( $this->dir . '/build' );

		if ( $block && ! empty( $block->editor_script_handles ) ) {
			foreach ( $block->editor_script_handles as $handle ) {
				wp_set_script_translations( $handle, 'resume-vehicule-block', $this->dir . '/languages' );
			}
		}
	}

	/**
	 * Prepends the Brakson block category.
	 *
	 * @param array $categories Registered categories.
	 * @return array
	 */
	public function register_block_category( array $categories ): array {
		foreach ( $categories as $category ) {
			if ( isset( $category['slug'] ) && self::BLOCK_CATEGORY === $category['slug'] ) {
				return $categories;
			}
		}

		array_unshift(
			$categories,
			array(
				'slug'  => self::BLOCK_CATEGORY,
				'title' => __( 'Brakson Gutenberg blocks', 'resume-vehicule-block' ),
				'icon'  => 'welcome-widgets-menus',
			)
		);

		return $categories;
	}
}
