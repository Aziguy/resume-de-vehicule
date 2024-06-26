/**
 * Registers a new block provided a unique name and an object defining its behavior.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */
import { registerBlockType } from "@wordpress/blocks";

/**
 * Lets webpack process SCSS files referenced in JavaScript files.
 * All files containing `style` keyword are bundled together. The code used
 * gets applied both to the front of your site and to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import "./index.scss";

/**
 * Internal dependencies
 */
import VehicleBlockEdit from "./components/VehicleBlockEdit";
import VehicleBlockSave from "./components/VehicleBlockSave";
import metadata from "./block.json";

/**
 * Every block starts by registering a new block type definition.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */
registerBlockType(metadata.name, {
	/**
	 * @see ./components/VehicleBlockEdit
	 */
	edit: VehicleBlockEdit,

	/**
	 * @see ./components/VehicleBlockSave
	 */
	save: VehicleBlockSave,
});
