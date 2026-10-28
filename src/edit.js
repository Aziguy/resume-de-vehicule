import {
	BlockControls,
	InspectorControls,
	useBlockProps,
} from '@wordpress/block-editor';
import {
	PanelBody,
	Placeholder,
	ToolbarButton,
	ToolbarGroup,
} from '@wordpress/components';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { update } from '@wordpress/icons';

import { getVehicle } from './api/vehicles';
import VehicleCard from './components/VehicleCard';
import VehicleSearch from './components/VehicleSearch';

export default function Edit( { attributes, setAttributes } ) {
	const { vehicle } = attributes;
	const [ isRefreshing, setIsRefreshing ] = useState( false );

	const onSelect = ( selected ) =>
		setAttributes( { vehicleId: selected?.id ?? '', vehicle: selected } );

	const refresh = () => {
		setIsRefreshing( true );
		getVehicle( vehicle.id )
			.then( ( fresh ) => fresh && setAttributes( { vehicle: fresh } ) )
			.catch( () => {} )
			.finally( () => setIsRefreshing( false ) );
	};

	const search = <VehicleSearch value={ vehicle } onSelect={ onSelect } />;

	return (
		<>
			{ vehicle?.id && (
				<BlockControls>
					<ToolbarGroup>
						<ToolbarButton
							icon={ update }
							label={ __(
								'Actualiser les données',
								'resume-vehicule-block'
							) }
							onClick={ refresh }
							isBusy={ isRefreshing }
							disabled={ isRefreshing }
						/>
					</ToolbarGroup>
				</BlockControls>
			) }
			<InspectorControls>
				<PanelBody
					title={ __( 'Véhicule', 'resume-vehicule-block' ) }
					icon="car"
				>
					{ search }
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				{ vehicle ? (
					<VehicleCard vehicle={ vehicle } />
				) : (
					<Placeholder
						icon="car"
						label={ __(
							'Résumé de véhicule',
							'resume-vehicule-block'
						) }
						instructions={ __(
							'Choisissez le véhicule à présenter.',
							'resume-vehicule-block'
						) }
					>
						<div style={ { width: '100%' } }>{ search }</div>
					</Placeholder>
				) }
			</div>
		</>
	);
}
