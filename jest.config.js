module.exports = {
	preset: '@wordpress/jest-preset-default',
	rootDir: __dirname,
	testMatch: [ '<rootDir>/tests/js/**/*.test.js' ],
	transform: {
		'\\.[cm]?[jt]sx?$': 'babel-jest',
	},
	transformIgnorePatterns: [
		'/node_modules/(?!(@wordpress|@ariakit|uuid|parsel-js|marked)/)',
	],
	setupFilesAfterEnv: [ '<rootDir>/tests/js/setup.js' ],
	collectCoverageFrom: [ 'src/**/*.js' ],
	coverageDirectory: 'coverage/js',
	coverageReporters: [ 'text-summary', 'lcov', 'clover' ],
};
