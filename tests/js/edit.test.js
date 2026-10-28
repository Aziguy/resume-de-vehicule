import { render, screen } from '@testing-library/react';

import Edit from '../../src/edit';
import { vehicle } from './fixtures';

jest.mock( '../../src/components/VehicleSearch', () => ( { onSelect } ) => (
	<button onClick={ () => onSelect( { id: 'x', brand: 'Dacia' } ) }>
		search
	</button>
) );

describe( 'Edit', () => {
	it( 'invites to pick a vehicle', () => {
		const setAttributes = jest.fn();
		const { container } = render(
			<Edit
				attributes={ { vehicleId: '', vehicle: null } }
				setAttributes={ setAttributes }
			/>
		);

		expect(
			container.querySelector( '.components-placeholder__instructions' )
		).toHaveTextContent( 'Choisissez le véhicule à présenter.' );

		screen.getByRole( 'button', { name: 'search' } ).click();

		expect( setAttributes ).toHaveBeenCalledWith( {
			vehicleId: 'x',
			vehicle: { id: 'x', brand: 'Dacia' },
		} );
	} );

	it( 'previews the selected vehicle', () => {
		render(
			<Edit
				attributes={ { vehicleId: vehicle.id, vehicle } }
				setAttributes={ jest.fn() }
			/>
		);

		expect(
			screen.getByText( 'Caractéristiques principales' )
		).toBeInTheDocument();
	} );
} );
