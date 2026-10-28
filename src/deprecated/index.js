import { useBlockProps } from '@wordpress/block-editor';

import { fromLegacy } from '../utils/vehicle';
import LegacyVehicleDetails from './LegacyVehicleDetails';

const v1 = {
	attributes: {
		vehicleId: { type: 'string', default: '' },
		vehicleDetails: { type: 'object', default: null },
		numberOfVehicles: { type: 'number', default: 10 },
	},
	supports: { align: [ 'wide', 'full' ], anchor: true, html: false },
	save( { attributes } ) {
		const { vehicleDetails } = attributes;

		return (
			<div { ...useBlockProps.save() }>
				{ vehicleDetails && (
					<LegacyVehicleDetails vehicleDetails={ vehicleDetails } />
				) }
			</div>
		);
	},
	migrate( { vehicleId, vehicleDetails } ) {
		return { vehicleId, vehicle: fromLegacy( vehicleDetails ) };
	},
};

export default [ v1 ];
