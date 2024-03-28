<?php
/**
 * Plugin Name: _Résumé de véhicule
 * Plugin URI: https://brakson.com/ 
 * Description: Affiche les caractéristiques techniques d'un véhicule depuis l'éditeur Gutenberg en se basant sur une base de données externe.
 * Version: 1.0.0
 * Author: Hippolyte KENGNI
 * Author URI: https://aziguy.github.io/Portfolio-Website/
 * Text Domain: resume-vehicule
 * Domain Path: /lang
 * License: GPL-2.0-or-later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Requires at least: 6.4.3
 * Requires PHP: 7.0
 *
 * @package Resume_Vehicule
 */

 


if ( ! defined( 'ABSPATH' ) ) {
    die( 'Kangaroos không thể nhảy ở đây! ( ͡° ͜ʖ ͡° )' );
}




class Resume_Vehicule_Block {

    /**
     * Class constructor.
     */
    public function __construct() {
        add_action( 'init', array( $this, 'register_block' ) );
        add_filter( 'block_categories_all', array( $this, 'register_block_category' ), 10, 2 );
    }

    /**
     * Register of our block.
     */
    public function register_block() {
        register_block_type( __DIR__ . '/build' );
    }

    /**
     * Adds a new custom block category.
     */
    public function register_block_category( $categories, $post ) {
        array_unshift( $categories, array(
            'slug'  => 'brakson-category',
            'title' => 'Brakson Gutenberg blocks',
            'icon' => 'welcome-widgets-menus',
        ) );

        return $categories;
    }
}

// We instantiate our class.
$resume_vehicule_block = new Resume_Vehicule_Block();