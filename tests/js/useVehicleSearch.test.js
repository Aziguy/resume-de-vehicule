import { renderHook, waitFor } from '@testing-library/react';

import { searchVehicles } from '../../src/api/vehicles';
import useVehicleSearch from '../../src/hooks/useVehicleSearch';
import { vehicle } from './fixtures';

jest.mock( '../../src/api/vehicles', () => ( { searchVehicles: jest.fn() } ) );

describe( 'useVehicleSearch', () => {
	it( 'returns the found vehicles', async () => {
		searchVehicles.mockResolvedValue( [ vehicle ] );

		const { result } = renderHook( () => useVehicleSearch( 'clio' ) );

		expect( result.current.isLoading ).toBe( true );
		await waitFor( () => expect( result.current.isLoading ).toBe( false ) );
		expect( result.current.vehicles ).toEqual( [ vehicle ] );
		expect( searchVehicles ).toHaveBeenCalledWith( 'clio' );
	} );

	it( 'ignores non array payloads', async () => {
		searchVehicles.mockResolvedValue( { code: 'oops' } );

		const { result } = renderHook( () => useVehicleSearch( '' ) );

		await waitFor( () => expect( result.current.isLoading ).toBe( false ) );
		expect( result.current.vehicles ).toEqual( [] );
	} );

	it( 'exposes errors', async () => {
		const error = new Error( 'down' );
		searchVehicles.mockRejectedValue( error );

		const { result } = renderHook( () => useVehicleSearch( '' ) );

		await waitFor( () => expect( result.current.error ).toBe( error ) );
		expect( result.current.vehicles ).toEqual( [] );
	} );

	it( 'drops stale responses', async () => {
		let resolveFirst;
		searchVehicles
			.mockReturnValueOnce(
				new Promise( ( resolve ) => ( resolveFirst = resolve ) )
			)
			.mockResolvedValueOnce( [ vehicle ] );

		const { result, rerender } = renderHook(
			( { term } ) => useVehicleSearch( term ),
			{ initialProps: { term: 'a' } }
		);

		rerender( { term: 'clio' } );
		await waitFor( () => expect( result.current.isLoading ).toBe( false ) );
		resolveFirst( [] );
		await Promise.resolve();

		expect( result.current.vehicles ).toEqual( [ vehicle ] );
	} );
} );
