import { render, screen } from '@testing-library/react';

import VehicleCard from '../../src/components/VehicleCard';
import { vehicle } from './fixtures';

describe( 'VehicleCard', () => {
	it( 'renders nothing without vehicle', () => {
		const { container } = render( <VehicleCard vehicle={ null } /> );

		expect( container ).toBeEmptyDOMElement();
	} );

	it( 'renders the title and main specifications', () => {
		render( <VehicleCard vehicle={ vehicle } /> );

		expect(
			screen.getByRole( 'heading', { name: 'Renault Clio' } )
		).toBeInTheDocument();
		expect( screen.getByText( 'Essence' ) ).toBeInTheDocument();
		expect( screen.getByText( '180 km/h' ) ).toBeInTheDocument();
		expect( screen.getByText( '90 ch' ) ).toBeInTheDocument();
		expect( screen.getByText( 'Commercialisé' ) ).toBeInTheDocument();
		expect(
			screen.getByText( 'Dernière mise à jour le 01 avril 2024' )
		).toBeInTheDocument();
		expect( screen.getByText( 'Source : Saabre' ) ).toBeInTheDocument();
	} );

	it( 'draws dimension gauges', () => {
		const { container } = render( <VehicleCard vehicle={ vehicle } /> );

		expect( screen.getByText( 'Longueur' ) ).toBeInTheDocument();
		expect( screen.getByText( '4,1 m' ) ).toBeInTheDocument();
		expect(
			[ ...container.querySelectorAll( '[style]' ) ].map(
				( bar ) => bar.style.width
			)
		).toEqual( [ '74%', '82%', '72%' ] );
	} );

	it( 'shows a price drop', () => {
		render( <VehicleCard vehicle={ vehicle } /> );

		expect( screen.getByText( '18 900 €' ) ).toBeInTheDocument();
		expect( screen.getByText( '19 500 €' ) ).toHaveClass( 'line-through' );
		expect( screen.getByText( '-3,1 %' ) ).toHaveClass(
			'text-emerald-300'
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

		expect( screen.getByText( '+5,6 %' ) ).toHaveClass( 'text-rose-300' );
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

		expect(
			screen.getByRole( 'heading', { name: 'Peugeot' } )
		).toBeInTheDocument();
		expect( screen.queryByText( 'Énergie' ) ).not.toBeInTheDocument();
		expect( screen.queryByText( 'Dimensions' ) ).not.toBeInTheDocument();
		expect( screen.queryByText( 'Prix' ) ).not.toBeInTheDocument();
		expect(
			screen.queryByText( /commercialisé/i )
		).not.toBeInTheDocument();
		expect( screen.queryByText( /Source/ ) ).not.toBeInTheDocument();
	} );

	it( 'renders every ADEME field', () => {
		render(
			<VehicleCard
				vehicle={ {
					...vehicle,
					version: 'KANGOO (130ch)',
					body: 'Combispace',
					gearbox: 'Automatique',
					weight: 1519,
					co2: 178,
					bonusMalus: 'Malus',
				} }
			/>
		);

		expect( screen.getByText( 'KANGOO (130ch)' ) ).toBeInTheDocument();
		expect( screen.getByText( 'Combispace' ) ).toBeInTheDocument();
		expect( screen.getByText( 'Automatique' ) ).toBeInTheDocument();
		expect( screen.getByText( '1 519 kg' ) ).toBeInTheDocument();
		expect( screen.getByText( '178 g/km' ) ).toBeInTheDocument();
		expect( screen.getByText( 'Malus' ) ).toBeInTheDocument();
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
