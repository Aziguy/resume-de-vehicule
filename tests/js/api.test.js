import apiFetch from '@wordpress/api-fetch';

import { ENDPOINT, getVehicle, searchVehicles } from '../../src/api/vehicles';

jest.mock( '@wordpress/api-fetch', () => jest.fn( () => Promise.resolve() ) );

describe( 'vehicles API', () => {
	beforeEach( () => apiFetch.mockClear() );

	it( 'searches through the REST proxy', () => {
		searchVehicles( 'clio', 5 );

		expect( apiFetch ).toHaveBeenCalledWith( {
			path: `${ ENDPOINT }?search=clio&per_page=5`,
		} );
	} );

	it( 'uses defaults', () => {
		searchVehicles();

		expect( apiFetch ).toHaveBeenCalledWith( {
			path: `${ ENDPOINT }?search=&per_page=20`,
		} );
	} );

	it( 'encodes the vehicle identifier', () => {
		getVehicle( 'a/b' );

		expect( apiFetch ).toHaveBeenCalledWith( {
			path: `${ ENDPOINT }/a%2Fb`,
		} );
	} );
} );
