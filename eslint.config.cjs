const globals = require( 'globals' );
const defaults = require( '@wordpress/scripts/config/eslint.config.cjs' );

module.exports = [
	{ ignores: [ 'coverage/**', 'src/deprecated/LegacyVehicleDetails.js' ] },
	...defaults,
	{
		files: [ 'tests/js/**/*.js' ],
		languageOptions: { globals: { ...globals.jest } },
	},
];
