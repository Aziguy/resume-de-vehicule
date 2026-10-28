import { fromLegacy, vehicleLabel } from '../../src/utils/vehicle';
import { legacyDetails, vehicle } from './fixtures';

describe( 'vehicleLabel', () => {
	it( 'joins brand, model and version', () => {
		expect(
			vehicleLabel( { brand: 'Renault', model: 'Clio', version: 'TCe' } )
		).toBe( 'Renault Clio TCe' );
	} );

	it( 'skips empty parts', () => {
		expect( vehicleLabel( { brand: 'Renault', model: null } ) ).toBe(
			'Renault'
		);
		expect( vehicleLabel( null ) ).toBe( '' );
	} );
} );

describe( 'fromLegacy', () => {
	it( 'normalizes the 1.0 Saabre payload', () => {
		expect( fromLegacy( legacyDetails ) ).toEqual( {
			...vehicle,
			power: null,
		} );
	} );

	it( 'flags ended commercialization', () => {
		const details = {
			data: {
				...legacyDetails.data,
				commercializationDates: { end: '2023-01-01' },
			},
		};

		expect( fromLegacy( details ).commercialized ).toBe( false );
	} );

	it( 'handles partial payloads', () => {
		const result = fromLegacy( { data: { id: 7, maxSpeed: 'n/a' } } );

		expect( result.id ).toBe( '7' );
		expect( result.maxSpeed ).toBeNull();
		expect( result.commercialized ).toBeNull();
		expect( result.price ).toEqual( { base: null, current: null } );
	} );

	it.each( [ null, undefined, {}, { data: 'x' } ] )(
		'returns null for %p',
		( value ) => {
			expect( fromLegacy( value ) ).toBeNull();
		}
	);
} );
