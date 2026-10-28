const toNumber = ( value ) => {
	if ( typeof value === 'number' ) {
		return Number.isFinite( value ) ? value : null;
	}

	if ( typeof value !== 'string' || value.trim() === '' ) {
		return null;
	}

	const parsed = Number( value.replace( /\s/g, '' ).replace( ',', '.' ) );

	return Number.isFinite( parsed ) ? parsed : null;
};

const toText = ( value ) =>
	typeof value === 'string' || typeof value === 'number'
		? String( value ).trim() || null
		: null;

export const vehicleLabel = ( vehicle ) =>
	[ vehicle?.brand, vehicle?.model, vehicle?.version ]
		.filter( Boolean )
		.join( ' ' );

/**
 * Converts the 1.0 "vehicleDetails" attribute (raw Saabre payload) to the normalized vehicle.
 *
 * @param {?Object} vehicleDetails Legacy attribute.
 * @return {?Object} Normalized vehicle.
 */
export function fromLegacy( vehicleDetails ) {
	const data = vehicleDetails?.data;

	if ( ! data || typeof data !== 'object' ) {
		return null;
	}

	const dates = data.commercializationDates;

	return {
		id: data.id !== undefined ? String( data.id ) : '',
		source: 'Saabre',
		brand: toText( data.brand ),
		model: toText( data.model ),
		version: null,
		energy: toText( data.energySource ),
		body: null,
		gearbox: null,
		power: null,
		weight: null,
		co2: null,
		maxSpeed: toNumber( data.maxSpeed ),
		bonusMalus: null,
		dimensions: {
			length: toNumber( data.dimensions?.length ),
			width: toNumber( data.dimensions?.width ),
			height: toNumber( data.dimensions?.height ),
		},
		price: {
			base: toNumber( data.pricing?.basePrice ),
			current: toNumber( data.pricing?.currentPrice ),
		},
		commercialized: dates ? ! dates.end : null,
		image: null,
		updatedAt: toText( data.lastUpdated ),
	};
}
