const defaults = require( '@wordpress/scripts/config/jest-unit.config' );

module.exports = {
	...defaults,
	testMatch: [ '<rootDir>/tests/js/**/*.test.js' ],
	setupFilesAfterEnv: [
		...( defaults.setupFilesAfterEnv ?? [] ),
		'<rootDir>/tests/js/setup.js',
	],
	collectCoverageFrom: [ 'src/**/*.js' ],
	coverageDirectory: 'coverage/js',
	coverageReporters: [ 'text-summary', 'lcov', 'clover' ],
};
