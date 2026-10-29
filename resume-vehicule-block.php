<?php
/**
 * Plugin Name:       Résumé de véhicule
 * Plugin URI:        https://github.com/Aziguy/resume-de-vehicule
 * Description:       Bloc Gutenberg affichant les caractéristiques techniques d'un véhicule issues d'une source de données externe.
 * Version:           1.1.0
 * Requires at least: 6.6
 * Requires PHP:      7.4
 * Author:            Hippolyte KENGNI
 * Author URI:        https://aziguy.github.io/Portfolio-Website/
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       resume-vehicule-block
 * Domain Path:       /languages
 *
 * @package ResumeVehicule
 */

namespace ResumeVehicule;

defined( 'ABSPATH' ) || exit;

const VERSION     = '1.1.0';
const PLUGIN_FILE = __FILE__;

require_once __DIR__ . '/includes/autoload.php';

( new Plugin( __DIR__ ) )->register();
