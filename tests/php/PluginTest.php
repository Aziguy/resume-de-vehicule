<?php

namespace ResumeVehicule\Tests;

use Brain\Monkey\Functions;
use ResumeVehicule\Plugin;

class PluginTest extends TestCase {

	public function test_register_hooks(): void {
		if ( ! defined( 'ResumeVehicule\PLUGIN_FILE' ) ) {
			define( 'ResumeVehicule\PLUGIN_FILE', '/plugins/resume-de-vehicule/resume-vehicule-block.php' );
		}

		Functions\when( 'plugin_basename' )->justReturn( 'resume-de-vehicule/resume-vehicule-block.php' );

		$plugin = new Plugin( '/plugins/resume-de-vehicule' );
		$plugin->register();

		$this->assertNotFalse( has_action( 'init', array( $plugin, 'register_block' ) ) );
		$this->assertNotFalse( has_filter( 'block_categories_all', array( $plugin, 'register_block_category' ) ) );
		$this->assertNotFalse( has_action( 'rest_api_init', 'ResumeVehicule\RestController->register_routes()' ) );
		$this->assertNotFalse( has_filter( 'plugin_action_links_resume-de-vehicule/resume-vehicule-block.php', array( $plugin, 'action_links' ) ) );
	}

	public function test_register_block_sets_translations(): void {
		Functions\expect( 'register_block_type' )
			->once()
			->with( '/plugins/resume-de-vehicule/build' )
			->andReturn( (object) array( 'editor_script_handles' => array( 'brakson-resume-vehicule-editor-script' ) ) );
		Functions\expect( 'wp_set_script_translations' )
			->once()
			->with( 'brakson-resume-vehicule-editor-script', 'resume-vehicule-block', '/plugins/resume-de-vehicule/languages' );

		( new Plugin( '/plugins/resume-de-vehicule/' ) )->register_block();
	}

	public function test_register_block_category_is_prepended_once(): void {
		$plugin     = new Plugin( '/plugins/resume-de-vehicule' );
		$categories = $plugin->register_block_category( array( array( 'slug' => 'text' ) ) );

		$this->assertSame( 'brakson-category', $categories[0]['slug'] );
		$this->assertCount( 2, $categories );
		$this->assertSame( $categories, $plugin->register_block_category( $categories ) );
	}

	public function test_action_links(): void {
		Functions\when( 'admin_url' )->alias(
			static function ( $path ) {
				return 'https://site.test/wp-admin/' . $path;
			}
		);

		$links = ( new Plugin( '/plugins/resume-de-vehicule' ) )->action_links( array( 'deactivate' => 'x' ) );

		$this->assertStringContainsString( 'options-general.php?page=resume-vehicule', $links[0] );
		$this->assertSame( 'x', $links['deactivate'] );
	}
}
