import React from "react";

const VehicleDetails = ({ vehicleDetails }) => {
	const { data } = vehicleDetails;

	// Formatage du prix
	const formatPrice = (price) => {
		return price
			.toFixed(2)
			.replace(/\d(?=(\d{3})+\.)/g, "$& ")
			.replace(".00", "");
	};

	// Détermination des classes en fonction des conditions
	const basePrice = parseFloat(data.pricing.basePrice);
	const currentPrice = parseFloat(data.pricing.currentPrice);
	const basePriceClasses =
		basePrice && currentPrice ? "text-black-600 line-through mr-2" : "";
	const currentPriceClasses =
		basePrice && currentPrice
			? basePrice > currentPrice
				? "text-xl font-bold text-green-600"
				: "text-xl font-bold text-red-600"
			: "";

	// Vérification si la date de début de commercialisation est null
	const isCommercialized = data.commercializationDates.start != null;

	// Formatage de la date
	const formattedDate = new Intl.DateTimeFormat("fr-FR", {
		day: "2-digit",
		month: "long",
		year: "numeric",
	}).format(new Date(data.lastUpdated));

	return (
		<div className="container mx-auto flex flex-col items-center justify-center">
			<div className="bg-white border-2 border-gray-200 rounded-lg shadow-lg p-4 flex flex-col md:flex-row">
				<div className="w-full md:w-3/4">
					<h3 className="text-xl font-bold mb-4 text-green-600">
						Caractéristiques principales
					</h3>
					<div className="flex items-center justify-between mb-4">
						<img
							src="https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/527.jpg"
							alt={`${data.brand} ${data.model}`}
							className="w-full md:w-1/2 rounded-t-lg md:rounded-l-lg"
						/>
						<div className="flex flex-col ml-4">
							<ul className="list-disc mb-4">
								<li className="mb-2 flex items-center">
									{basePrice && currentPrice && (
										<span className={basePriceClasses}>
											{formatPrice(basePrice)} €
										</span>
									)}
									<span className={currentPriceClasses}>
										{formatPrice(currentPrice)} €
									</span>
								</li>
								<li className="mb-2 flex items-center">
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
							<ul className="list-disc">
								<li className="mb-2 flex items-center">
									Marque : <span className="font-bold"> {data.brand}</span>
								</li>
								<li className="mb-2 flex items-center">
									Modèle : <span className="font-bold"> {data.model}</span>
								</li>
								<li className="mb-2 flex items-center">
									Source d'énergie :
									<span className="font-bold">{data.energySource}</span>
								</li>
								<li className="mb-2 flex items-center">
									Vitesse max :{" "}
									<span className="font-bold">{data.maxSpeed} km/h</span>
								</li>
							</ul>
						</div>
					</div>
				</div>
				<div className="bg-gray-800 text-white w-full md:w-1/4 p-4">
					<h3 className="text-xl font-bold mb-4">Dimensions</h3>
					<ul className="list-disc">
						<li className="mb-2 flex items-center">
							<span>Longueur : </span>
							<span>{data.dimensions.length}</span>
						</li>
						<li className="mb-2 flex items-center">
							<span>Largeur : </span>
							<span>{data.dimensions.width}</span>
						</li>
						<li className="mb-2 flex items-center">
							<span>Hauteur : </span>
							<span>{data.dimensions.height}</span>
						</li>
					</ul>
					<hr className="my-4 border-gray-600" />
					<p>Dernière mise à jour : {formattedDate}</p>
				</div>
			</div>
		</div>
	);
};

export default VehicleDetails;
