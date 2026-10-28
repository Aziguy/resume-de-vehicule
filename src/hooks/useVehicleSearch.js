import { useEffect, useState } from '@wordpress/element';

import { searchVehicles } from '../api/vehicles';

/**
 * Fetches vehicles matching the term, ignoring stale responses.
 *
 * @param {string} term Search term.
 * @return {{vehicles: Object[], isLoading: boolean, error: ?Error}} Search state.
 */
export default function useVehicleSearch( term ) {
	const [ state, setState ] = useState( {
		vehicles: [],
		isLoading: true,
		error: null,
	} );

	useEffect( () => {
		let active = true;

		setState( ( previous ) => ( {
			...previous,
			isLoading: true,
			error: null,
		} ) );

		searchVehicles( term )
			.then( ( vehicles ) => {
				if ( active ) {
					setState( {
						vehicles: Array.isArray( vehicles ) ? vehicles : [],
						isLoading: false,
						error: null,
					} );
				}
			} )
			.catch( ( error ) => {
				if ( active ) {
					setState( { vehicles: [], isLoading: false, error } );
				}
			} );

		return () => {
			active = false;
		};
	}, [ term ] );

	return state;
}
