import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';

export const ENDPOINT = '/resume-vehicule/v1/vehicles';

export const searchVehicles = ( search = '', perPage = 20 ) =>
	apiFetch( {
		path: addQueryArgs( ENDPOINT, { search, per_page: perPage } ),
	} );

export const getVehicle = ( id ) =>
	apiFetch( { path: `${ ENDPOINT }/${ encodeURIComponent( id ) }` } );
