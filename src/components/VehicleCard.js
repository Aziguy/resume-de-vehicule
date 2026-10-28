import { FiTrendingDown, FiTrendingUp } from 'react-icons/fi';
import { MdDirectionsCar } from 'react-icons/md';

import {
	formatDate,
	formatNumber,
	formatPrice,
	isNumber,
	millimetersToMeters,
	priceTrend,
} from '../utils/format';
import { vehicleLabel } from '../utils/vehicle';

/*
 * Rendered by both edit and save: keep it pure and free of translated strings,
 * otherwise saved blocks become invalid when the site language changes.
 */

const TREND_CLASSES = { down: 'text-green-600', up: 'text-red-600' };

const withUnit = ( value, unit ) =>
	isNumber( value ) ? `${ formatNumber( value ) } ${ unit }` : null;

function Spec( { label, value } ) {
	if ( value === null || value === undefined || value === '' ) {
		return null;
	}

	return (
		<div className="flex justify-between gap-4 border-b border-gray-300 py-1">
			<dt className="text-zinc-600">{ label }</dt>
			<dd className="m-0 text-right font-bold text-zinc-950">
				{ value }
			</dd>
		</div>
	);
}

function Price( { price } ) {
	if ( ! isNumber( price?.current ) ) {
		return null;
	}

	const trend = priceTrend( price );

	return (
		<p className="m-0 flex items-center gap-2 text-lg">
			{ trend && (
				<span className="text-zinc-500 line-through">
					{ formatPrice( price.base ) }
				</span>
			) }
			<span
				className={ `font-bold ${
					TREND_CLASSES[ trend ] ?? 'text-zinc-950'
				}` }
			>
				{ formatPrice( price.current ) }
			</span>
			{ trend === 'down' && (
				<FiTrendingDown
					aria-label="Prix en baisse"
					className="h-5 w-5 text-green-600"
				/>
			) }
			{ trend === 'up' && (
				<FiTrendingUp
					aria-label="Prix en hausse"
					className="h-5 w-5 text-red-600"
				/>
			) }
		</p>
	);
}

function Status( { commercialized } ) {
	if ( typeof commercialized !== 'boolean' ) {
		return null;
	}

	return commercialized ? (
		<span className="inline-block rounded border border-green-600 px-2 py-1 text-sm text-green-600">
			Commercialisé
		</span>
	) : (
		<span className="inline-block rounded bg-gray-400 px-2 py-1 text-sm text-white">
			Non commercialisé
		</span>
	);
}

export default function VehicleCard( { vehicle } ) {
	if ( ! vehicle ) {
		return null;
	}

	const { dimensions = {}, price = {} } = vehicle;
	const label = vehicleLabel( vehicle );
	const updatedAt = formatDate( vehicle.updatedAt );
	const sizes = [
		[ 'Longueur', dimensions.length ],
		[ 'Largeur', dimensions.width ],
		[ 'Hauteur', dimensions.height ],
	].filter( ( [ , value ] ) => isNumber( value ) );

	return (
		<article className="flex flex-col overflow-hidden rounded-lg bg-zinc-100 shadow-lg md:flex-row">
			<div className="flex-1 p-6">
				<h3 className="m-0 mb-4 text-2xl font-bold text-lime-500">
					Caractéristiques principales
				</h3>
				<div className="flex flex-col gap-6 sm:flex-row">
					<div className="flex shrink-0 items-center justify-center sm:w-48">
						{ vehicle.image ? (
							<img
								className="h-32 w-48 rounded-xl object-cover"
								src={ vehicle.image }
								alt={ label }
								loading="lazy"
							/>
						) : (
							<MdDirectionsCar
								aria-hidden="true"
								className="h-32 w-32 text-zinc-400"
							/>
						) }
					</div>
					<div className="flex flex-1 flex-col gap-3">
						<Price price={ price } />
						<div>
							<Status commercialized={ vehicle.commercialized } />
						</div>
						<dl className="m-0 text-base leading-6">
							<Spec label="Marque" value={ vehicle.brand } />
							<Spec label="Modèle" value={ vehicle.model } />
							<Spec label="Version" value={ vehicle.version } />
							<Spec label="Énergie" value={ vehicle.energy } />
							<Spec label="Carrosserie" value={ vehicle.body } />
							<Spec label="Boîte" value={ vehicle.gearbox } />
							<Spec
								label="Puissance"
								value={ withUnit( vehicle.power, 'ch' ) }
							/>
							<Spec
								label="Vitesse max"
								value={ withUnit( vehicle.maxSpeed, 'km/h' ) }
							/>
							<Spec
								label="Poids à vide"
								value={ withUnit( vehicle.weight, 'kg' ) }
							/>
							<Spec
								label="CO2 (mixte)"
								value={ withUnit( vehicle.co2, 'g/km' ) }
							/>
							<Spec
								label="Bonus / malus"
								value={ vehicle.bonusMalus }
							/>
						</dl>
					</div>
				</div>
			</div>
			<aside className="flex flex-col justify-end gap-4 bg-zinc-800 p-6 text-white md:w-60">
				{ sizes.length > 0 && (
					<dl className="m-0 text-base leading-6">
						<dt className="text-zinc-400">Dimensions</dt>
						{ sizes.map( ( [ name, value ] ) => (
							<dd className="m-0" key={ name }>
								{ name } : { millimetersToMeters( value ) } m
							</dd>
						) ) }
					</dl>
				) }
				{ updatedAt && (
					<p className="m-0 text-sm text-zinc-400">
						Dernière mise à jour le { updatedAt }
					</p>
				) }
				{ vehicle.source && (
					<p className="m-0 text-xs text-zinc-400">
						Source : { vehicle.source }
					</p>
				) }
			</aside>
		</article>
	);
}
