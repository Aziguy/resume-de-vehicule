import { render, screen } from '@testing-library/react';

import VehicleCard from '../../src/components/VehicleCard';
import { vehicle } from './fixtures';

describe( 'VehicleCard', () => {
	it( 'renders nothing without vehicle', () => {
		const { container } = render( <VehicleCard vehicle={ null } /> );

		expect( container ).toBeEmptyDOMElement();
	} );

	it( 'renders the main specifications', () => {
		render( <VehicleCard vehicle={ vehicle } /> );

		expect( screen.getByText( 'Renault' ) ).toBeInTheDocument();
		expect( screen.getByText( 'Clio' ) ).toBeInTheDocument();
		expect( screen.getByText( '180 km/h' ) ).toBeInTheDocument();
		expect( screen.getByText( '90 ch' ) ).toBeInTheDocument();
		expect( screen.getByText( 'Commercialisé' ) ).toBeInTheDocument();
		expect( screen.getByText( 'Longueur : 4,1 m' ) ).toBeInTheDocument();
		expect(
			screen.getByText( 'Dernière mise à jour le 01 avril 2024' )
		).toBeInTheDocument();
		expect( screen.getByText( 'Source : Saabre' ) ).toBeInTheDocument();
	} );

	it( 'shows a price drop', () => {
		render( <VehicleCard vehicle={ vehicle } /> );

		expect( screen.getByText( '19 500 €' ) ).toHaveClass( 'line-through' );
		expect( screen.getByText( '18 900 €' ) ).toHaveClass(
			'text-green-600'
		);
		expect( screen.getByLabelText( 'Prix en baisse' ) ).toBeInTheDocument();
	} );

	it( 'shows a price increase', () => {
		render(
			<VehicleCard
				vehicle={ {
					...vehicle,
					price: { base: 18000, current: 19000 },
				} }
			/>
		);

		expect( screen.getByText( '19 000 €' ) ).toHaveClass( 'text-red-600' );
		expect( screen.getByLabelText( 'Prix en hausse' ) ).toBeInTheDocument();
	} );

	it( 'hides missing data', () => {
		render(
			<VehicleCard
				vehicle={ {
					id: '1',
					brand: 'Peugeot',
					dimensions: {},
					price: {},
					commercialized: null,
				} }
			/>
		);

		expect( screen.queryByText( 'Modèle' ) ).not.toBeInTheDocument();
		expect( screen.queryByText( 'Dimensions' ) ).not.toBeInTheDocument();
		expect( screen.queryByText( /€/ ) ).not.toBeInTheDocument();
		expect(
			screen.queryByText( /commercialisé/i )
		).not.toBeInTheDocument();
	} );

	it( 'flags vehicles no longer sold', () => {
		render(
			<VehicleCard vehicle={ { ...vehicle, commercialized: false } } />
		);

		expect( screen.getByText( 'Non commercialisé' ) ).toBeInTheDocument();
	} );

	it( 'displays the vehicle picture when provided', () => {
		render(
			<VehicleCard
				vehicle={ {
					...vehicle,
					image: 'https://example.com/clio.png',
				} }
			/>
		);

		expect(
			screen.getByRole( 'img', { name: 'Renault Clio' } )
		).toHaveAttribute( 'src', 'https://example.com/clio.png' );
	} );
} );
