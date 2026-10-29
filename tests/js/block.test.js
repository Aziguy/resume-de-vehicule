import {
	createBlock,
	getBlockTypes,
	getSaveContent,
	parse,
	serialize,
	setCategories,
	unregisterBlockType,
} from '@wordpress/blocks';

import metadata from '../../src/block.json';
import deprecated from '../../src/deprecated';
import { legacyDetails, vehicle } from './fixtures';

const [ v11, v1 ] = deprecated;

const wrap = ( attributes, content ) =>
	`<!-- wp:${ metadata.name } ${ JSON.stringify(
		attributes
	) } -->\n${ content }\n<!-- /wp:${ metadata.name } -->`;

describe( 'resume-vehicule block', () => {
	beforeAll( () => {
		setCategories( [ { slug: metadata.category, title: 'Brakson' } ] );
		require( '../../src/index' );
	} );

	afterAll( () => {
		getBlockTypes().forEach( ( { name } ) => unregisterBlockType( name ) );
	} );

	it( 'is registered from block.json', () => {
		expect(
			getBlockTypes().some( ( { name } ) => name === metadata.name )
		).toBe( true );
	} );

	it( 'round-trips its saved markup', () => {
		const html = serialize(
			createBlock( metadata.name, { vehicleId: vehicle.id, vehicle } )
		);
		const [ block ] = parse( html );

		expect( block.isValid ).toBe( true );
		expect( block.attributes.vehicle ).toEqual( vehicle );
		expect( html ).toContain( 'Caractéristiques principales' );
	} );

	it( 'saves an empty wrapper without vehicle', () => {
		const html = serialize( createBlock( metadata.name ) );

		expect( html ).toContain( 'wp-block-brakson-resume-vehicule' );
		expect( parse( html )[ 0 ].isValid ).toBe( true );
	} );

	it( 'upgrades content saved by version 1.1', () => {
		const attributes = { vehicleId: vehicle.id, vehicle };
		const [ block ] = parse(
			wrap(
				attributes,
				getSaveContent( { ...v11, name: metadata.name }, attributes )
			)
		);

		expect( block.isValid ).toBe( true );
		expect( block.attributes.vehicle ).toEqual( vehicle );
		expect( serialize( block ) ).toContain( 'rv-card' );
		expect( console ).toHaveInformed();
	} );

	it( 'migrates content saved by version 1.0', () => {
		const attributes = {
			vehicleId: 'abc-123',
			vehicleDetails: legacyDetails,
			numberOfVehicles: 10,
		};
		const content = getSaveContent(
			{ ...v1, name: metadata.name },
			attributes
		);
		const html = `<!-- wp:${ metadata.name } ${ JSON.stringify( {
			vehicleId: attributes.vehicleId,
			vehicleDetails: attributes.vehicleDetails,
		} ) } -->\n${ content }\n<!-- /wp:${ metadata.name } -->`;

		const [ block ] = parse( html );

		expect( block.isValid ).toBe( true );
		expect( block.attributes.vehicleId ).toBe( 'abc-123' );
		expect( block.attributes.vehicle ).toEqual( {
			...vehicle,
			power: null,
		} );
		expect( block.attributes.vehicleDetails ).toBeUndefined();
		expect( console ).toHaveInformed();
	} );
} );
