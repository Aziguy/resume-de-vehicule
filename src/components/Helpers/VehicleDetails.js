const VehicleDetails = ({ vehicleDetails }) => {
	return (
		<div>
			<h2>{`${vehicleDetails.data.brand} ${vehicleDetails.data.model}`}</h2>
			<p>{`Vitesse max: ${vehicleDetails.data.maxSpeed} km/h`}</p>
			<p>{`Source d'énergie: ${vehicleDetails.data.energySource}`}</p>
		</div>
	);
};

export default VehicleDetails;
