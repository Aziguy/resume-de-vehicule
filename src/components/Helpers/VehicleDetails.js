import { useInstanceId } from "@wordpress/compose";

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

export default VehicleDetails;
