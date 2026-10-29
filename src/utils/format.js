/**
 * Locale independent formatters: saved markup must be identical in every browser.
 */

const MONTHS = [
	'janvier',
	'février',
	'mars',
	'avril',
	'mai',
	'juin',
	'juillet',
	'août',
	'septembre',
	'octobre',
	'novembre',
	'décembre',
];

export const isNumber = ( value ) =>
	typeof value === 'number' && Number.isFinite( value );

export function formatNumber( value, decimals = 0 ) {
	if ( ! isNumber( value ) ) {
		return '';
	}

	const rounded = Number(
		`${ Math.round(
			`${ Math.abs( value ) }e${ decimals }`
		) }e-${ decimals }`
	);
	const [ integer, fraction ] = rounded.toFixed( decimals ).split( '.' );
	const grouped = integer.replace( /\B(?=(\d{3})+(?!\d))/g, ' ' );
	const sign = value < 0 ? '-' : '';

	return fraction && /[1-9]/.test( fraction )
		? `${ sign }${ grouped },${ fraction.replace( /0+$/, '' ) }`
		: `${ sign }${ grouped }`;
}

export const formatPrice = ( value ) =>
	isNumber( value ) ? `${ formatNumber( value ) } €` : '';

export const millimetersToMeters = ( value ) =>
	isNumber( value ) ? formatNumber( value / 1000, 1 ) : '';

export function formatDate( value ) {
	const date = value ? new Date( value ) : null;

	if ( ! date || Number.isNaN( date.getTime() ) ) {
		return '';
	}

	return `${ String( date.getUTCDate() ).padStart( 2, '0' ) } ${
		MONTHS[ date.getUTCMonth() ]
	} ${ date.getUTCFullYear() }`;
}

/**
 * Returns the price trend between base and current price.
 *
 * @param {Object} price         Vehicle price.
 * @param {number} price.base    Catalog price.
 * @param {number} price.current Current price.
 * @return {?string} "down", "up" or null.
 */
export function priceTrend( { base, current } = {} ) {
	if ( ! isNumber( base ) || ! isNumber( current ) || base === current ) {
		return null;
	}

	return current < base ? 'down' : 'up';
}

/**
 * Returns the signed price variation, e.g. "-3,1 %".
 *
 * @param {Object} price         Vehicle price.
 * @param {number} price.base    Catalog price.
 * @param {number} price.current Current price.
 * @return {string} Formatted variation or an empty string.
 */
export function priceVariation( { base, current } = {} ) {
	if ( ! priceTrend( { base, current } ) || base === 0 ) {
		return '';
	}

	const variation = ( ( current - base ) / base ) * 100;

	return `${ variation > 0 ? '+' : '' }${ formatNumber( variation, 1 ) } %`;
}

/**
 * Returns value / max as a whole percentage clamped between 4 and 100.
 *
 * @param {number} value Measured value.
 * @param {number} max   Reference value.
 * @return {number} Percentage, 0 when unknown.
 */
export function ratio( value, max ) {
	if ( ! isNumber( value ) || ! isNumber( max ) || max <= 0 ) {
		return 0;
	}

	return Math.min( 100, Math.max( 4, Math.round( ( value / max ) * 100 ) ) );
}
