<?php
/**
 * Removes plugin data on uninstall.
 *
 * @package ResumeVehicule
 */

defined( 'WP_UNINSTALL_PLUGIN' ) || exit;

delete_option( 'resume_vehicule_settings' );
