import { PanelBody, SelectControl } from "@wordpress/components";

const VehicleSelector = ({ vehicles, onSelectVehicle }) => {
	return (
		<PanelBody title="Sélectionner un véhicule" icon="car" initialOpen={true}>
			<SelectControl
				label="Choisir le véhicule"
				options={[
					{ label: "Liste des véhicules", value: "" },
					...vehicles.map((vehicle) => ({
						label: `${vehicle.brand} ${vehicle.model}`,
						value: vehicle.id.toString(),
					})),
				]}
				onChange={onSelectVehicle}
			/>
		</PanelBody>
	);
};

export default VehicleSelector;
