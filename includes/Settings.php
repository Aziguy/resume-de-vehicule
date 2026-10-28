<?php
/**
 * Plugin settings.
 *
 * @package ResumeVehicule
 */

namespace ResumeVehicule;

use ResumeVehicule\Providers\ProviderRegistry;

/**
 * Stores options and renders the settings page.
 */
class Settings {

	const OPTION = 'resume_vehicule_settings';
	const PAGE   = 'resume-vehicule';

	/**
	 * Available providers, used by the settings page.
	 *
	 * @var ProviderRegistry|null
	 */
	private $registry;

	/**
	 * Default values.
	 *
	 * @return array
	 */
	public static function defaults(): array {
		return array(
			'provider'   => 'saabre',
			'saabre_url' => 'https://saabre-fake-api.osc-fr1.scalingo.io',
			'cache_ttl'  => 12 * HOUR_IN_SECONDS,
		);
	}

	/**
	 * Returns every setting merged with defaults.
	 *
	 * @return array
	 */
	public function all(): array {
		$stored = get_option( self::OPTION, array() );
		$values = array_merge( self::defaults(), is_array( $stored ) ? $stored : array() );

		/**
		 * Filters the plugin settings.
		 *
		 * @param array $values Settings.
		 */
		return (array) apply_filters( 'resume_vehicule_settings', $values );
	}

	/**
	 * Returns a single setting.
	 *
	 * @param string $key Setting key.
	 * @return mixed
	 */
	public function get( string $key ) {
		$values = $this->all();

		return $values[ $key ] ?? null;
	}

	/**
	 * Sanitizes submitted values.
	 *
	 * @param mixed $input Raw input.
	 * @return array
	 */
	public function sanitize( $input ): array {
		$input    = is_array( $input ) ? $input : array();
		$defaults = self::defaults();

		$url = isset( $input['saabre_url'] ) ? esc_url_raw( trim( (string) $input['saabre_url'] ) ) : '';
		$ttl = isset( $input['cache_ttl'] ) ? absint( $input['cache_ttl'] ) : $defaults['cache_ttl'];

		return array(
			'provider'   => isset( $input['provider'] ) ? sanitize_key( $input['provider'] ) : $defaults['provider'],
			'saabre_url' => '' !== $url ? untrailingslashit( $url ) : $defaults['saabre_url'],
			'cache_ttl'  => min( $ttl, WEEK_IN_SECONDS ),
		);
	}

	/**
	 * Registers admin hooks.
	 *
	 * @param ProviderRegistry $registry Available providers.
	 */
	public function register( ProviderRegistry $registry ): void {
		$this->registry = $registry;

		add_action( 'admin_init', array( $this, 'register_setting' ) );
		add_action( 'admin_menu', array( $this, 'add_page' ) );
	}

	/**
	 * Registers the option.
	 */
	public function register_setting(): void {
		register_setting(
			self::PAGE,
			self::OPTION,
			array(
				'type'              => 'object',
				'sanitize_callback' => array( $this, 'sanitize' ),
				'default'           => self::defaults(),
			)
		);
	}

	/**
	 * Adds the settings page.
	 */
	public function add_page(): void {
		add_options_page(
			__( 'Résumé de véhicule', 'resume-vehicule-block' ),
			__( 'Résumé de véhicule', 'resume-vehicule-block' ),
			'manage_options',
			self::PAGE,
			array( $this, 'render_page' )
		);
	}

	/**
	 * Renders the settings page.
	 */
	public function render_page(): void {
		$values    = $this->all();
		$providers = $this->registry ? $this->registry->labels() : array();
		$name      = self::OPTION;
		?>
		<div class="wrap">
			<h1><?php echo esc_html( get_admin_page_title() ); ?></h1>
			<form method="post" action="options.php">
				<?php settings_fields( self::PAGE ); ?>
				<table class="form-table" role="presentation">
					<tr>
						<th scope="row"><label for="rv-provider"><?php esc_html_e( 'Source des données', 'resume-vehicule-block' ); ?></label></th>
						<td>
							<select id="rv-provider" name="<?php echo esc_attr( $name ); ?>[provider]">
								<?php foreach ( $providers as $id => $label ) : ?>
									<option value="<?php echo esc_attr( $id ); ?>" <?php selected( $values['provider'], $id ); ?>><?php echo esc_html( $label ); ?></option>
								<?php endforeach; ?>
							</select>
						</td>
					</tr>
					<tr>
						<th scope="row"><label for="rv-saabre-url"><?php esc_html_e( 'URL de l\'API Saabre', 'resume-vehicule-block' ); ?></label></th>
						<td><input id="rv-saabre-url" class="regular-text" type="url" name="<?php echo esc_attr( $name ); ?>[saabre_url]" value="<?php echo esc_attr( $values['saabre_url'] ); ?>"></td>
					</tr>
					<tr>
						<th scope="row"><label for="rv-cache-ttl"><?php esc_html_e( 'Durée du cache (secondes)', 'resume-vehicule-block' ); ?></label></th>
						<td>
							<input id="rv-cache-ttl" class="small-text" type="number" min="0" name="<?php echo esc_attr( $name ); ?>[cache_ttl]" value="<?php echo esc_attr( (string) $values['cache_ttl'] ); ?>">
							<p class="description"><?php esc_html_e( '0 désactive le cache.', 'resume-vehicule-block' ); ?></p>
						</td>
					</tr>
				</table>
				<?php submit_button(); ?>
			</form>
		</div>
		<?php
	}
}
