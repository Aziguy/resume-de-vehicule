import { FiTrendingUp, FiTrendingDown } from "react-icons/fi";

const VehicleDetails = ({ vehicleDetails }) => {
	const { data } = vehicleDetails;

	// We format the price
	const formatPrice = (price) => {
		return price
			.toFixed(2)
			.replace(/\d(?=(\d{3})+\.)/g, "$& ")
			.replace(".00", "");
	};

	// Determine classes based on conditions
	const basePrice = parseFloat(data.pricing.basePrice);
	const currentPrice = parseFloat(data.pricing.currentPrice);
	const priceDifference = currentPrice - basePrice;
	const basePriceClasses =
		basePrice && currentPrice ? "text-black-600 line-through mr-2" : "";
	const currentPriceClasses =
		basePrice && currentPrice
			? basePrice > currentPrice
				? "font-bold text-green-600"
				: "font-bold text-red-600"
			: "";
	const arrowIcon =
		priceDifference < 0 ? (
			<FiTrendingDown className="h-5 w-5 flex-shrink-0 text-green-600" />
		) : (
			<FiTrendingUp className="h-5 w-5 flex-shrink-0 text-red-600" />
		);

	// Checking if commercializationDates.end exists
	const isCommercialized = data.commercializationDates.end;

	// We format the date
	const formattedDate = new Intl.DateTimeFormat("fr-FR", {
		day: "2-digit",
		month: "long",
		year: "numeric",
	}).format(new Date(data.lastUpdated));

	// We convert from mm to m round to 1 decimal
	const convertMillimetersToMeters = (mm) => {
		const meters = mm / 1000;
		const roundedMeters = Math.round(meters * 10) / 10;
		return new Intl.NumberFormat("fr-FR", {
			maximumFractionDigits: 1,
		}).format(roundedMeters);
	};

	return (
		<div className="inline-flex w-full flex-row items-start bg-zinc-100 pl-6 tracking-[0px] rounded-lg shadow-lg">
			<div className="flex flex-grow flex-wrap items-center justify-center gap-x-5 gap-y-5 self-stretch min-[710px]:flex-nowrap">
				<div className="flex h-[25rem] w-[34rem] flex-shrink-0 flex-col items-center justify-center gap-y-6">
					<div className="font-barlow_condensed flex items-center self-stretch px-1.5 text-left text-2xl font-bold leading-9 text-lime-500 mt-8">
						Caractéristiques principales
					</div>
					<div className="font-helvetica flex flex-grow items-start justify-center gap-x-12 self-stretch">
						<img
							className="h-32 w-48 flex-shrink-0 rounded-xl object-cover object-center mix-blend-normal m-auto"
							src="https://www.dreamcarsevents.com/wp-content/uploads/kisspng-car-renault-seat-len-seat-ibiza-renault-clio-iv-5b19ec60d69f96.4549975915284255688791.png"
							alt={`${data.brand} ${data.model}`}
						/>
						<div className="flex flex-col items-center justify-center gap-y-1 self-stretch">
							<div className="flex flex-col items-center justify-center gap-y-1 self-stretch pr-[3px]">
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
										{"  "}
										{arrowIcon}
									</li>
									<li className="mb-2 flex items-center">
										{isCommercialized ? (
											<span className="bg-gray-400 text-white px-2 py-1 rounded inline-block align-middle">
												Non commercialisé
											</span>
										) : (
											<span className="border border-green-600 text-green-600 px-2 py-1 rounded inline-block align-middle">
												Commercialisé
											</span>
										)}
									</li>
								</ul>

								<div className="flex items-end self-stretch pt-1 text-left text-base leading-6 border-b border-gray-300 py-1">
									<span>
										<span className="font-normal text-zinc-600">Marque : </span>
										<span className="font-bold text-zinc-950">
											{data.brand}
										</span>
									</span>
								</div>

								<div className="flex items-end self-stretch pt-1 text-left text-base leading-6 border-b border-gray-300 py-1">
									<span>
										<span className="font-normal text-zinc-600">Modèle : </span>
										<span className="font-bold text-zinc-950">
											{data.model}
										</span>
									</span>
								</div>
							</div>
							<div className="flex flex-col items-center justify-center gap-y-1 self-stretch text-base leading-6">
								<div className="flex flex-col items-start justify-center gap-y-2 self-stretch text-center">
									<div className="flex justify-center self-stretch">
										<span className="border-b border-gray-300 py-1">
											<span className="font-normal text-zinc-600">
												Source d'énergie :{" "}
											</span>
											<span className="font-bold text-zinc-950  ">
												{data.energySource}
											</span>
										</span>
									</div>
								</div>
								<div className="flex flex-col items-start justify-center gap-y-2 self-stretch text-left">
									<div>
										<span className="font-normal text-zinc-600">
											Vitesse max :{" "}
										</span>
										<span className="font-bold text-zinc-950">
											{data.maxSpeed} km/h
										</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="font-helvetica flex w-60 flex-shrink-0 flex-col items-start justify-end gap-y-3 self-stretch bg-zinc-800 px-6 py-14 text-left font-normal">
					<div className="w-48 text-base leading-6">
						<span className="text-zinc-400">
							Dimensions :
							<br />
						</span>
						<span className="text-white">
							Longueur : {convertMillimetersToMeters(data.dimensions.length)} m
							<br />
						</span>
						<span className="text-white">
							Largeur : {convertMillimetersToMeters(data.dimensions.width)} m
							<br />
						</span>
						<span className="text-white">
							Hauteur : {convertMillimetersToMeters(data.dimensions.height)} m
							<br />
						</span>
					</div>

					<hr class="border-gray-400 font-bold my-4" />

					<div className="self-stretch text-sm leading-5 text-zinc-400 ">
						Dernière mise à jour faite le {formattedDate}
					</div>
				</div>
			</div>
		</div>
	);
};

export default VehicleDetails;
