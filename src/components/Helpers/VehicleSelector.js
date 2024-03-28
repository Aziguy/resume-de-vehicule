import {
	InspectorControls,
	PanelBody,
	SelectControl,
} from "@wordpress/components";

const VehicleSelector = ({
	vehicles,
	selectedVehicleId,
	handleVehicleChange,
}) => {
	const vehicleOptions = vehicles
		? [
				{ label: "Liste des véhicules", value: "" },
				...vehicles.map((vehicle) => ({
					label: `${vehicle.brand} ${vehicle.model}`,
					value: vehicle.id,
				})),
		  ]
		: [];

	return (
		<InspectorControls>
			<PanelBody title="Sélectionner un véhicule" icon="car" initialOpen={true}>
				<SelectControl
					label="Choisir le véhicule"
					value={selectedVehicleId}
					options={vehicleOptions}
					onChange={handleVehicleChange}
				/>
			</PanelBody>
		</InspectorControls>
	);
};

export default VehicleSelector;
