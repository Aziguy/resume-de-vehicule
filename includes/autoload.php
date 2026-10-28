<?php
/**
 * PSR-4 autoloader for the ResumeVehicule namespace.
 *
 * @package ResumeVehicule
 */

spl_autoload_register(
	static function ( $class ) {
		$prefix = 'ResumeVehicule\\';

		if ( 0 !== strpos( $class, $prefix ) ) {
			return;
		}

		$file = __DIR__ . '/' . str_replace( '\\', '/', substr( $class, strlen( $prefix ) ) ) . '.php';

		if ( is_readable( $file ) ) {
			require_once $file;
		}
	}
);
