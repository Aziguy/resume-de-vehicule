import {
	MdBolt,
	MdCo2,
	MdDirectionsCar,
	MdOutlineScale,
	MdOutlineSpeed,
	MdSettings,
	MdTrendingDown,
	MdTrendingUp,
} from 'react-icons/md';
import { TbCarSuv, TbEngine, TbLeaf } from 'react-icons/tb';

import {
	formatDate,
	formatNumber,
	formatPrice,
	isNumber,
	millimetersToMeters,
	priceTrend,
	priceVariation,
	ratio,
} from '../utils/format';
import { vehicleLabel } from '../utils/vehicle';

/*
 * Rendered by both edit and save: keep it pure and free of translated strings,
 * otherwise saved blocks become invalid when the site language changes.
 * Any markup change requires a new entry in src/deprecated.
 */

const DIMENSIONS = [
	[ 'Longueur', 'length', 5500 ],
	[ 'Largeur', 'width', 2200 ],
	[ 'Hauteur', 'height', 2000 ],
];

const withUnit = ( value, unit ) =>
	isNumber( value ) ? `${ formatNumber( value ) } ${ unit }` : null;

function Spec( { icon: Icon, label, value } ) {
	if ( value === null || value === undefined || value === '' ) {
		return null;
	}

	return (
		<div className="rounded-xl border border-white/10 bg-white/5 p-3 transition-colors hover:border-cyan-400/40">
			<dt className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.12em] text-slate-400">
				<Icon aria-hidden="true" className="h-4 w-4 text-cyan-300" />
				{ label }
			</dt>
			<dd className="m-0 mt-1 text-sm font-semibold text-white [overflow-wrap:anywhere] sm:text-base">
				{ value }
			</dd>
		</div>
	);
}

function Status( { commercialized } ) {
	if ( typeof commercialized !== 'boolean' ) {
		return null;
	}

	return commercialized ? (
		<span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300">
			<span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_2px_rgba(52,211,153,0.7)]" />
			Commercialisé
		</span>
	) : (
		<span className="inline-flex items-center gap-2 rounded-full border border-slate-500/30 bg-slate-500/10 px-3 py-1 text-xs font-medium text-slate-300">
			<span className="h-2 w-2 rounded-full bg-slate-400" />
			Non commercialisé
		</span>
	);
}

function Price( { price } ) {
	if ( ! isNumber( price?.current ) ) {
		return null;
	}

	const trend = priceTrend( price );
	const TrendIcon = trend === 'down' ? MdTrendingDown : MdTrendingUp;

	return (
		<div>
			<p className="m-0 text-[11px] font-medium uppercase tracking-[0.12em] text-slate-400">
				Prix
			</p>
			<p className="m-0 mt-1 text-4xl font-bold tabular-nums tracking-tight text-white">
				{ formatPrice( price.current ) }
			</p>
			{ trend && (
				<p className="m-0 mt-2 flex flex-wrap items-center gap-2 text-sm">
					<span className="text-slate-500 line-through">
						{ formatPrice( price.base ) }
					</span>
					<span
						className={ `inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-semibold ${
							trend === 'down'
								? 'bg-emerald-400/10 text-emerald-300'
								: 'bg-rose-400/10 text-rose-300'
						}` }
					>
						<TrendIcon
							aria-label={
								trend === 'down'
									? 'Prix en baisse'
									: 'Prix en hausse'
							}
							className="h-4 w-4"
						/>
						{ priceVariation( price ) }
					</span>
				</p>
			) }
		</div>
	);
}

function Dimensions( { dimensions = {} } ) {
	const rows = DIMENSIONS.filter( ( [ , key ] ) =>
		isNumber( dimensions[ key ] )
	);

	if ( ! rows.length ) {
		return null;
	}

	return (
		<section className="mt-6">
			<h4 className="m-0 mb-3 text-[11px] font-medium uppercase tracking-[0.12em] text-slate-400">
				Dimensions
			</h4>
			<dl className="m-0 grid gap-3">
				{ rows.map( ( [ name, key, max ] ) => (
					<div key={ key }>
						<div className="flex justify-between text-sm">
							<dt className="text-slate-300">{ name }</dt>
							<dd className="m-0 tabular-nums text-white">
								{ millimetersToMeters( dimensions[ key ] ) } m
							</dd>
						</div>
						<div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/10">
							<div
								className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-fuchsia-500"
								style={ {
									width: `${ ratio( dimensions[ key ], max ) }%`,
								} }
							/>
						</div>
					</div>
				) ) }
			</dl>
		</section>
	);
}

export default function VehicleCard( { vehicle } ) {
	if ( ! vehicle ) {
		return null;
	}

	const updatedAt = formatDate( vehicle.updatedAt );
	const title = [ vehicle.brand, vehicle.model ]
		.filter( Boolean )
		.join( ' ' );

	return (
		<article className="rv-card relative overflow-hidden rounded-3xl bg-gradient-to-br from-cyan-400 via-fuchsia-500 to-violet-600 p-px shadow-[0_0_60px_-15px_rgba(34,211,238,0.55)]">
			<div className="relative overflow-hidden rounded-[calc(1.5rem-1px)] bg-slate-950 p-6 text-slate-100 md:p-8">
				<div
					aria-hidden="true"
					className="rv-grid pointer-events-none absolute inset-0 opacity-30"
				/>
				<div
					aria-hidden="true"
					className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-cyan-500/30 blur-3xl"
				/>
				<div
					aria-hidden="true"
					className="pointer-events-none absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-fuchsia-600/20 blur-3xl"
				/>

				<div className="relative">
					<header className="flex flex-wrap items-start justify-between gap-4">
						<div className="min-w-0">
							<p className="m-0 text-xs font-medium uppercase tracking-[0.3em] text-cyan-300">
								Caractéristiques principales
							</p>
							<h3 className="m-0 mt-2 bg-gradient-to-r from-white via-cyan-100 to-fuchsia-200 bg-clip-text text-3xl font-bold leading-tight text-transparent md:text-4xl">
								{ title || vehicleLabel( vehicle ) }
							</h3>
							{ vehicle.version && (
								<p className="m-0 mt-1 text-sm text-slate-400">
									{ vehicle.version }
								</p>
							) }
						</div>
						<Status commercialized={ vehicle.commercialized } />
					</header>

					<div className="mt-6 grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
						<div className="flex flex-col gap-6">
							<div className="flex h-44 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-b from-white/10 to-white/0">
								{ vehicle.image ? (
									<img
										className="h-40 w-full object-contain drop-shadow-[0_12px_24px_rgba(34,211,238,0.35)]"
										src={ vehicle.image }
										alt={ vehicleLabel( vehicle ) }
										loading="lazy"
									/>
								) : (
									<MdDirectionsCar
										aria-hidden="true"
										className="h-28 w-28 text-cyan-300/80 drop-shadow-[0_0_18px_rgba(34,211,238,0.6)]"
									/>
								) }
							</div>
							<Price price={ vehicle.price } />
						</div>

						<div>
							<dl className="m-0 grid grid-cols-2 gap-3 lg:grid-cols-3">
								<Spec
									icon={ MdBolt }
									label="Énergie"
									value={ vehicle.energy }
								/>
								<Spec
									icon={ TbEngine }
									label="Puissance"
									value={ withUnit( vehicle.power, 'ch' ) }
								/>
								<Spec
									icon={ MdOutlineSpeed }
									label="Vitesse max"
									value={ withUnit(
										vehicle.maxSpeed,
										'km/h'
									) }
								/>
								<Spec
									icon={ MdSettings }
									label="Boîte"
									value={ vehicle.gearbox }
								/>
								<Spec
									icon={ TbCarSuv }
									label="Carrosserie"
									value={ vehicle.body }
								/>
								<Spec
									icon={ MdOutlineScale }
									label="Poids à vide"
									value={ withUnit( vehicle.weight, 'kg' ) }
								/>
								<Spec
									icon={ MdCo2 }
									label="CO2 mixte"
									value={ withUnit( vehicle.co2, 'g/km' ) }
								/>
								<Spec
									icon={ TbLeaf }
									label="Bonus / malus"
									value={ vehicle.bonusMalus }
								/>
							</dl>
							<Dimensions dimensions={ vehicle.dimensions } />
						</div>
					</div>

					{ ( updatedAt || vehicle.source ) && (
						<footer className="mt-6 flex flex-wrap justify-between gap-2 border-t border-white/10 pt-4 text-xs text-slate-400">
							{ updatedAt && (
								<span>
									Dernière mise à jour le { updatedAt }
								</span>
							) }
							{ vehicle.source && (
								<span>Source : { vehicle.source }</span>
							) }
						</footer>
					) }
				</div>
			</div>
		</article>
	);
}
