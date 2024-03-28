const VehicleDetails = ({ vehicleDetails }) => {
	// We format the price
	const basePrice = parseFloat(vehicleDetails.data.pricing.basePrice);
	const currentPrice = parseFloat(vehicleDetails.data.pricing.currentPrice);

	const formatPrice = (price) => {
		return price
			.toFixed(2)
			.replace(/\d(?=(\d{3})+\.)/g, "$& ")
			.replace(".00", "");
	};
	// Determine classes based on conditions
	const basePriceClasses =
		basePrice && currentPrice ? "text-black-600 line-through mr-2" : "";
	const currentPriceClasses =
		basePrice && currentPrice
			? basePrice > currentPrice
				? "text-xl font-bold text-green-600"
				: "text-xl font-bold text-red-600"
			: "";
	// Checking if start_date is null
	const isCommercialized =
		vehicleDetails.data.commercializationDates.start != null;
	const dateObject = new Date(vehicleDetails.data.lastUpdated);
	// Format options for the date
	const options = { day: "2-digit", month: "long", year: "numeric" };

	// Convert date to formatted string
	const formattedDate = new Intl.DateTimeFormat("fr-FR", options).format(
		dateObject,
	);

	return (
		<div class="container mx-auto flex flex-col items-center justify-center">
			<div class="bg-white border-2 border-gray-200 rounded-lg shadow-lg p-4 flex flex-col md:flex-row">
				<div class="w-full md:w-3/4">
					<h3 class="text-xl font-bold mb-4 text-green-600">
						Caractéristiques principales
					</h3>
					<div class="flex items-center justify-between mb-4">
						<img
							src="https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/527.jpg"
							alt="Image de la voiture"
							class="w-full md:w-1/2 rounded-t-lg md:rounded-l-lg"
						/>
						<div class="flex flex-col ml-4">
							<ul class="list-disc mb-4">
								<li class="mb-2 flex items-center">
									{basePrice && currentPrice && (
										<span className={basePriceClasses}>
											{formatPrice(basePrice)} €
										</span>
									)}
									{/* We display current price with conditional color */}
									<span className={currentPriceClasses}>
										{formatPrice(currentPrice)} €
									</span>
								</li>
								<li class="mb-2 flex items-center">
									{/* We display "Commercialisé" if start date is null */}

									{isCommercialized ? (
										<span className="border border-green-600 text-green-600 px-2 py-1 rounded inline-block align-middle">
											Commercialisé
										</span>
									) : (
										<span className="bg-gray-400 text-white px-2 py-1 rounded inline-block align-middle">
											Non commercialisé
										</span>
									)}
								</li>
							</ul>
							<ul class="list-disc">
								<li class="mb-2 flex items-center">
									<span class="font-bold ">
										Marque : {vehicleDetails.data.brand}
									</span>
									<hr className="border-gray-300 my-2" />
								</li>
								<li class="mb-2 flex items-center">
									<span class="font-bold">
										Modèle : {vehicleDetails.data.model}
									</span>
								</li>
								<li class="mb-2 flex items-center">
									<span class="font-bold">
										Source d'nergie : {vehicleDetails.data.energySource}
									</span>
								</li>
								<li class="mb-2 flex items-center">
									<span class="font-bold">
										Vitesse max : {vehicleDetails.data.maxSpeed} km/h
									</span>
								</li>
							</ul>
						</div>
					</div>
				</div>
				<div class="bg-gray-800 text-white w-full md:w-1/4 p-4">
					<h3 class="text-xl font-bold mb-4">Dimensions</h3>
					<ul class="list-disc">
						<li class="mb-2 flex items-center">
							<span>Longueur : </span>
							<span>{vehicleDetails.data.dimensions.length}</span>
						</li>
						<li class="mb-2 flex items-center">
							<span>Largeur : </span>
							<span>{vehicleDetails.data.dimensions.width}</span>
						</li>
						<li class="mb-2 flex items-center">
							<span>Hauteur : </span>
							<span>{vehicleDetails.data.dimensions.height}</span>
						</li>
					</ul>
					<hr class="my-4" />
					<p>Dernière mise à jour : {formattedDate}</p>
				</div>
			</div>
		</div>
	);
};

export default VehicleDetails;
