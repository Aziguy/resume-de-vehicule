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

import { Fragment } from "@wordpress/element";
import {
	useBlockProps,
	InspectorControls,
	getBlockProps,
} from "@wordpress/block-editor";
import { useState, useEffect } from "@wordpress/element";
import { useSelect, useDispatch } from "@wordpress/data";
import { PanelBody, SelectControl, Spinner } from "@wordpress/components";
import { useInstanceId } from "@wordpress/compose";
import { Component } from "@wordpress/element";
import VehicleApi from "../Api/VehicleApi";

/**
 * The VehicleBlockEdit class describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {Element} Element to render.
 */

const VehicleDetails = ({ selectedVehicle, vehicles }) => {
	const vehicle = vehicles.find((v) => v.id === selectedVehicle);

	return (
		<div>
			{vehicle && (
				<div>
					<h2>
						{vehicle.brand} {vehicle.model}
					</h2>
					<p>
						<strong>Max Speed:</strong> {vehicle.maxSpeed}
					</p>
					<p>
						<strong>Energy Source:</strong> {vehicle.energySource}
					</p>
					<p>
						<strong>Dimensions:</strong>
					</p>
					<ul>
						<li>Length: {vehicle.dimensions.length}</li>
						<li>Width: {vehicle.dimensions.width}</li>
						<li>Height: {vehicle.dimensions.height}</li>
					</ul>
					<p>
						<strong>Pricing:</strong>
					</p>
					<ul>
						<li>Base Price: {vehicle.pricing.basePrice}</li>
						<li>Current Price: {vehicle.pricing.currentPrice}</li>
					</ul>
				</div>
			)}
		</div>
	);
};

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

const VehicleBlockEdit = () => {
	const [vehicles, setVehicles] = useState([]);
	const [selectedVehicleId, setSelectedVehicleId] = useState("");
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchVehicles = async () => {
			try {
				const fetchedVehicles = await VehicleApi.getAllVehicles();
				setVehicles(fetchedVehicles);
				setLoading(false);
			} catch (error) {
				console.error("Error fetching vehicles:", error);
			}
		};

		fetchVehicles();
	}, []);

	useEffect(() => {
		const storedSelectedVehicleId = localStorage.getItem("selectedVehicleId");
		if (storedSelectedVehicleId) {
			setSelectedVehicleId(storedSelectedVehicleId);
		}
	}, []);

	const handleVehicleChange = (selectedVehicleId) => {
		setSelectedVehicleId(selectedVehicleId);
		localStorage.setItem("selectedVehicleId", selectedVehicleId);
	};

	const blockProps = useBlockProps(); // Utiliser useBlockProps sans spécifier d'arguments

	return (
		<div {...blockProps}>
			<VehicleSelector
				vehicles={vehicles}
				selectedVehicleId={selectedVehicleId}
				handleVehicleChange={handleVehicleChange}
			/>
			{loading ? (
				<Spinner />
			) : (
				<VehicleDetails
					selectedVehicle={selectedVehicleId}
					vehicles={vehicles}
				/>
			)}
		</div>
	);
};

export default VehicleBlockEdit;
