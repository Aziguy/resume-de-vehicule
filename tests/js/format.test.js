import {
	formatDate,
	formatNumber,
	formatPrice,
	millimetersToMeters,
	priceTrend,
} from '../../src/utils/format';

describe( 'formatNumber', () => {
	it.each( [
		[ 0, 0, '0' ],
		[ 1234567, 0, '1 234 567' ],
		[ -4500, 0, '-4 500' ],
		[ 4.05, 1, '4,1' ],
		[ 4.0, 1, '4' ],
		[ 12.5, 2, '12,5' ],
	] )( 'formats %p with %p decimals as %p', ( value, decimals, expected ) => {
		expect( formatNumber( value, decimals ) ).toBe( expected );
	} );

	it.each( [ null, undefined, NaN, '12', Infinity ] )(
		'returns an empty string for %p',
		( value ) => {
			expect( formatNumber( value ) ).toBe( '' );
		}
	);
} );

describe( 'formatPrice', () => {
	it( 'adds the euro sign', () => {
		expect( formatPrice( 18900 ) ).toBe( '18 900 €' );
	} );

	it( 'ignores missing values', () => {
		expect( formatPrice( null ) ).toBe( '' );
	} );
} );

describe( 'millimetersToMeters', () => {
	it( 'converts and rounds to one decimal', () => {
		expect( millimetersToMeters( 4050 ) ).toBe( '4,1' );
		expect( millimetersToMeters( 1440 ) ).toBe( '1,4' );
	} );

	it( 'ignores missing values', () => {
		expect( millimetersToMeters( undefined ) ).toBe( '' );
	} );
} );

describe( 'formatDate', () => {
	it( 'formats ISO dates in French', () => {
		expect( formatDate( '2024-04-01T00:00:00+00:00' ) ).toBe(
			'01 avril 2024'
		);
		expect( formatDate( '2023-12-25' ) ).toBe( '25 décembre 2023' );
	} );

	it.each( [ null, '', 'not a date' ] )(
		'returns an empty string for %p',
		( value ) => {
			expect( formatDate( value ) ).toBe( '' );
		}
	);
} );

describe( 'priceTrend', () => {
	it( 'detects a price drop', () => {
		expect( priceTrend( { base: 20000, current: 18000 } ) ).toBe( 'down' );
	} );

	it( 'detects a price increase', () => {
		expect( priceTrend( { base: 18000, current: 20000 } ) ).toBe( 'up' );
	} );

	it( 'returns null without comparison', () => {
		expect( priceTrend( { base: 18000, current: 18000 } ) ).toBeNull();
		expect( priceTrend( { current: 18000 } ) ).toBeNull();
		expect( priceTrend() ).toBeNull();
	} );
} );
