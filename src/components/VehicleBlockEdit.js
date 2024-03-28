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
import { useBlockProps, InspectorControls } from "@wordpress/block-editor";
import { PanelBody, SelectControl, Spinner } from "@wordpress/components";
import { Component } from "@wordpress/element";
import VehicleApi from "../Api/VehicleApi";

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {Element} Element to render.
 */

class VehicleBlockEdit extends Component {
	constructor() {
		super(...arguments);
		this.state = {
			vehicles: [],
			selectedVehicleId: "",
			isLoading: true,
		};
		this.getVehicles();
	}

	async getVehicles() {
		try {
			const vehicles = await VehicleApi.getAllVehicles();
			this.setState({ vehicles, isLoading: false });
		} catch (error) {
			console.error("Error fetching vehicles:", error);
			// Gérer les erreurs de manière appropriée
		}
	}

	render() {
		const { vehicles, selectedVehicleId, isLoading } = this.state;

		if (isLoading) {
			return <Spinner />;
		}

		return (
			<div>
				<InspectorControls>
					<PanelBody
						title="Sélectionner un véhicule"
						icon="car"
						initialOpen={true}
					>
						<SelectControl
							label="Choisir un véhicule"
							value={selectedVehicleId}
							options={vehicles.map((vehicle) => ({
								label: `${vehicle.brand} ${vehicle.model}`,
								value: vehicle.id,
							}))}
							onChange={(value) => this.setState({ selectedVehicleId: value })}
						/>
					</PanelBody>
				</InspectorControls>
				<div>Nous ajouterons d'autres éléments de contenu du bloc ici...</div>
			</div>
		);
	}
}

export default VehicleBlockEdit;
