import { registerBlockType } from '@wordpress/blocks';

import './style.scss';

import metadata from './block.json';
import deprecated from './deprecated';
import Edit from './edit';
import save from './save';

registerBlockType( metadata, { edit: Edit, save, deprecated } );
