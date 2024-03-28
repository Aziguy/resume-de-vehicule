/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from "@wordpress/i18n";

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useState, useEffect } from "react";
import { useBlockProps, InspectorControls } from "@wordpress/block-editor";
import VehicleApi from "../Api/VehicleApi";
import VehicleSelector from "./Helpers/VehicleSelector";
import VehicleDetails from "./Helpers/VehicleDetails";

/**
 * The VehicleBlockEdit class describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {Element} Element to render.
 */

const VehicleBlockEdit = ({ attributes, setAttributes }) => {
	const { vehicleId, numberOfVehicles } = attributes;
	const [vehicles, setVehicles] = useState([]);
	const [vehicleDetails, setVehicleDetails] = useState(null);

	useEffect(() => {
		// We fetch vehicle data from API
		VehicleApi.getAllVehicles()
			.then((data) => {
				setVehicles(data);
			})
			.catch((error) => {
				console.error("Error fetching vehicle data:", error.message);
			});

		// We fetch details of selected vehicle
		if (vehicleId) {
			VehicleApi.getVehicleById(vehicleId)
				.then((data) => {
					setVehicleDetails(data);
				})
				.catch((error) => {
					console.error("Error fetching vehicle details:", error.message);
				});
		}
	}, []);

	const onSelectVehicle = (vehicleId) => {
		setAttributes({ vehicleId });
		VehicleApi.getVehicleById(vehicleId)
			.then((data) => {
				setVehicleDetails(data);
			})
			.catch((error) => {
				console.error("Error fetching vehicle details:", error.message);
			});
	};

	return (
		<>
			<InspectorControls>
				<VehicleSelector
					vehicles={vehicles}
					onSelectVehicle={onSelectVehicle}
				/>
			</InspectorControls>
			<div {...useBlockProps()}>
				{vehicleDetails ? (
					<VehicleDetails vehicleDetails={vehicleDetails} />
				) : (
					<p>Merci de bien vouloir sélectionner un véhicule dans la liste!</p>
				)}
			</div>
		</>
	);
};

export default VehicleBlockEdit;
