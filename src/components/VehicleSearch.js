import { ComboboxControl, Notice } from '@wordpress/components';
import { useDebounce } from '@wordpress/compose';
import { useMemo, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import useVehicleSearch from '../hooks/useVehicleSearch';
import { vehicleLabel } from '../utils/vehicle';

export default function VehicleSearch( { value, onSelect } ) {
	const [ term, setTerm ] = useState( '' );
	const setDebouncedTerm = useDebounce( setTerm, 300 );
	const { vehicles, isLoading, error } = useVehicleSearch( term );

	const options = useMemo( () => {
		const list = value?.id
			? [ value, ...vehicles.filter( ( item ) => item.id !== value.id ) ]
			: vehicles;

		return list.map( ( item ) => ( {
			value: item.id,
			label: vehicleLabel( item ) || item.id,
		} ) );
	}, [ vehicles, value ] );

	const onChange = ( id ) => {
		const selected = [ value, ...vehicles ].find(
			( item ) => item && item.id === id
		);

		onSelect( selected ?? null );
	};

	return (
		<>
			<ComboboxControl
				__next40pxDefaultSize
				__nextHasNoMarginBottom
				label={ __(
					'Rechercher un véhicule',
					'resume-vehicule-block'
				) }
				help={
					isLoading
						? __( 'Chargement…', 'resume-vehicule-block' )
						: __(
								'Saisissez une marque ou un modèle.',
								'resume-vehicule-block'
							)
				}
				value={ value?.id ?? null }
				options={ options }
				onChange={ onChange }
				onFilterValueChange={ setDebouncedTerm }
			/>
			{ error && (
				<Notice status="error" isDismissible={ false }>
					{ error.message ||
						__(
							'Impossible de charger les véhicules.',
							'resume-vehicule-block'
						) }
				</Notice>
			) }
		</>
	);
}
