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

	const [ integer, fraction ] = Math.abs( value )
		.toFixed( decimals )
		.split( '.' );
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
