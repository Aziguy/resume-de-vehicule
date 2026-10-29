import { useBlockProps } from '@wordpress/block-editor';

import { fromLegacy } from '../utils/vehicle';
import LegacyVehicleDetails from './LegacyVehicleDetails';
import VehicleCardV11 from './VehicleCardV11';

const supports = { align: [ 'wide', 'full' ], anchor: true, html: false };

const v11 = {
	attributes: {
		vehicleId: { type: 'string', default: '' },
		vehicle: { type: 'object', default: null },
	},
	supports,
	save( { attributes } ) {
		return (
			<div { ...useBlockProps.save() }>
				<VehicleCardV11 vehicle={ attributes.vehicle } />
			</div>
		);
	},
};

const v1 = {
	attributes: {
		vehicleId: { type: 'string', default: '' },
		vehicleDetails: { type: 'object', default: null },
		numberOfVehicles: { type: 'number', default: 10 },
	},
	supports,
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

export default [ v11, v1 ];
