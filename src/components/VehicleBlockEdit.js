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
/*
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
import VehicleApi from "../Api/VehicleApi";*/

/**
 * The VehicleBlockEdit class describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {Element} Element to render.
 */

import { useState, useEffect } from "react";
import { useBlockProps, InspectorControls } from "@wordpress/block-editor";
import { PanelBody, SelectControl } from "@wordpress/components";
import VehicleApi from "../Api/VehicleApi";

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
				<PanelBody title="Saabre block" icon="car" initialOpen={true}>
					<SelectControl
						label="Sélectionner un véhicule"
						value={vehicleId || ""}
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
			</InspectorControls>
			<div {...useBlockProps()}>
				{vehicleDetails ? (
					<div>
						<h2>{`${vehicleDetails.data.brand} ${vehicleDetails.data.model}`}</h2>
						<p>{`Vitesse max: ${vehicleDetails.data.maxSpeed} km/h`}</p>
						<p>{`Source d'énergie: ${vehicleDetails.data.energySource}`}</p>
					</div>
				) : (
					<p>Merci de bien vouloir sélectionner un véhicule dans la liste!</p>
				)}
			</div>
		</>
	);
};

export default VehicleBlockEdit;
