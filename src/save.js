import { useBlockProps } from '@wordpress/block-editor';

import VehicleCard from './components/VehicleCard';

export default function save( { attributes } ) {
	return (
		<div { ...useBlockProps.save() }>
			<VehicleCard vehicle={ attributes.vehicle } />
		</div>
	);
}
