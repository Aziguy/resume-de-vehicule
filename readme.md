### === Vehicle Summary Gutenberg Block ===

**Contributors:** Aziguy, F7b5
**Tags:** block, Gutenberg, vehicle  
**Tested up to:** 6.4.3  
**Stable tag:** 0.1.0  
**License:** GPL-2.0-or-later  
**License URI:** [https://www.gnu.org/licenses/gpl-2.0.html](https://www.gnu.org/licenses/gpl-2.0.html)

This WordPress plugin enables the display of technical specifications for vehicles directly within the Gutenberg editor. Leveraging an external database, it seamlessly retrieves and showcases this information.

## === Features ===

- Display vehicle technical specifications within the Gutenberg editor.
- Integration of a new Gutenberg block named "Vehicle Summary".
- Customization options for block appearance and displayed information.
- Addition of a new Gutenberg block category named "Brakson Gutenberg blocks".

## === Requirements ===

- WordPress version 6.4.3 or later.
- PHP version 7.0 or later.

## === Installation ===

1. Download the plugin from [the plugin's URL on the Brakson website](https://brakson.com/).
2. Upload the ZIP file to your WordPress installation.
3. Activate the plugin through the WordPress "Plugins" page.

## === Usage ===

Once activated, you can utilize the "Vehicle Summary" block within the Gutenberg editor. Customize the displayed information according to the external database utilized.

## === Tailwind Configuration ===

This project utilizes Tailwind CSS for style management. To compile CSS files, execute the following command:

```bash
npm run build:css
```

This command compiles the `tailwind.css` file located in the `src/assets/css` directory into a `style.css` file within the `build` directory.

## === npm Dependencies ===

This project uses npm for dependency management. Below are the project's devDependencies:

- `@wordpress/scripts`: WordPress script collection for development.
- `autoprefixer`: PostCSS tool for automatically adding CSS browser prefixes.
- `postcss`: CSS post-processing tool.
- `tailwindcss`: Utility-first CSS framework.

And here are the project's dependencies:

- `@wordpress/block-editor`: WordPress block editor module.
- `@wordpress/blocks`: API for registering and managing WordPress blocks.
- `@wordpress/components`: WordPress UI components.
- `@wordpress/compose`: Library for creating functional React components in WordPress.
- `@wordpress/data`: Data management in WordPress applications.
- `@wordpress/element`: API for creating React elements in WordPress.
- `axios`: Promise-based HTTP client for browsers and node.js.

## === Support ===

If you encounter any issues or have questions regarding the usage of this plugin, please [contact us](https://www.saabre.com/).

## === Contributions ===

Contributions are welcome! If you'd like to contribute to the improvement of this plugin, please submit a pull request on [GitHub](https://github.com/Aziguy/resume-de-vehicule).

## === License ===

This plugin is distributed under the [GPL-2.0-or-later](https://www.gnu.org/licenses/gpl-2.0.html) license. Refer to the LICENSE file for more details.
