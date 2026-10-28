import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import VehicleSearch from '../../src/components/VehicleSearch';
import useVehicleSearch from '../../src/hooks/useVehicleSearch';
import { vehicle } from './fixtures';

jest.mock( '../../src/hooks/useVehicleSearch', () => jest.fn() );

const peugeot = { ...vehicle, id: 'p-208', brand: 'Peugeot', model: '208' };

describe( 'VehicleSearch', () => {
	beforeEach( () => {
		jest.useFakeTimers();
		useVehicleSearch.mockReturnValue( {
			vehicles: [ vehicle, peugeot ],
			isLoading: false,
			error: null,
		} );
	} );

	afterEach( () => jest.useRealTimers() );

	it( 'selects a vehicle from the suggestions', async () => {
		const user = userEvent.setup( {
			advanceTimers: jest.advanceTimersByTime,
		} );
		const onSelect = jest.fn();
		render( <VehicleSearch value={ null } onSelect={ onSelect } /> );

		await user.type( screen.getByRole( 'combobox' ), 'Peu' );
		act( () => jest.runOnlyPendingTimers() );
		await user.click(
			screen.getByRole( 'option', { name: 'Peugeot 208' } )
		);

		expect( onSelect ).toHaveBeenCalledWith( peugeot );
		expect( useVehicleSearch ).toHaveBeenLastCalledWith( 'Peu' );
	} );

	it( 'keeps the current vehicle among the options', () => {
		useVehicleSearch.mockReturnValue( {
			vehicles: [ peugeot ],
			isLoading: false,
			error: null,
		} );

		render( <VehicleSearch value={ vehicle } onSelect={ jest.fn() } /> );

		expect( screen.getByRole( 'combobox' ) ).toHaveValue( 'Renault Clio' );
	} );

	it( 'shows the loading state', () => {
		useVehicleSearch.mockReturnValue( {
			vehicles: [],
			isLoading: true,
			error: null,
		} );

		render( <VehicleSearch value={ null } onSelect={ jest.fn() } /> );

		expect( screen.getByText( 'Chargement…' ) ).toBeInTheDocument();
	} );

	it( 'reports errors', () => {
		useVehicleSearch.mockReturnValue( {
			vehicles: [],
			isLoading: false,
			error: new Error( 'La source de données est indisponible.' ),
		} );

		const { container } = render(
			<VehicleSearch value={ null } onSelect={ jest.fn() } />
		);

		expect(
			container.querySelector( '.components-notice__content' )
		).toHaveTextContent( 'La source de données est indisponible.' );
	} );
} );
