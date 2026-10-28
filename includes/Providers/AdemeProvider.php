<?php
/**
 * ADEME Car Labelling open data provider.
 *
 * @package ResumeVehicule
 */

namespace ResumeVehicule\Providers;

use ResumeVehicule\Vehicle;

/**
 * Public dataset of new vehicles sold in France (Licence Ouverte 2.0), served by Data Fair.
 *
 * @link https://data.ademe.fr/datasets/ademe-car-labelling
 */
class AdemeProvider implements ProviderInterface {

	const ENDPOINT = 'https://data.ademe.fr/data-fair/api/v1/datasets/ademe-car-labelling/lines';

	const KW_TO_HP = 1.35962;

	/**
	 * @var HttpClient
	 */
	private $http;

	/**
	 * @param HttpClient $http HTTP client.
	 */
	public function __construct( HttpClient $http ) {
		$this->http = $http;
	}

	public function id(): string {
		return 'ademe';
	}

	public function label(): string {
		return __( 'ADEME Car Labelling (open data)', 'resume-vehicule-block' );
	}

	public function search( string $term, int $limit ): array {
		$query = array( 'size' => max( 1, $limit ) );
		$term  = trim( $term );

		if ( '' !== $term ) {
			$query['q'] = $term;
		}

		return $this->results( $this->http->get_json( self::ENDPOINT, $query ) );
	}

	public function find( string $id ): ?array {
		$query = array(
			'size' => 1,
			'qs'   => '_id:"' . str_replace( '"', '', $id ) . '"',
		);

		$results = $this->results( $this->http->get_json( self::ENDPOINT, $query ) );

		return $results[0] ?? null;
	}

	/**
	 * Maps a dataset line to the normalized shape.
	 *
	 * Column keys vary between exports ("Prix véhicule", "Prix_vehicule"...),
	 * so they are matched on a lowercase ASCII form.
	 *
	 * @param array $line Raw line.
	 * @return array
	 */
	public function map( array $line ): array {
		$row = array();

		foreach ( $line as $key => $value ) {
			$row[ self::key( (string) $key ) ] = $value;
		}

		$kw  = Vehicle::number( $row['puissancemaximale'] ?? null );
		$co2 = Vehicle::number( $row['co2vitessemixtemax'] ?? $row['co2vitessemixtemin'] ?? null );

		return Vehicle::normalize(
			array(
				'id'             => $row['id'] ?? '',
				'source'         => 'ADEME Car Labelling',
				'brand'          => $row['marque'] ?? null,
				'model'          => $row['modele'] ?? $row['libellemodele'] ?? null,
				'version'        => $row['descriptioncommerciale'] ?? null,
				'energy'         => $row['energie'] ?? null,
				'body'           => $row['carrosserie'] ?? null,
				'gearbox'        => $row['typedeboite'] ?? null,
				'power'          => $kw ? (int) round( $kw * self::KW_TO_HP ) : null,
				'weight'         => $row['poidsavide'] ?? null,
				'co2'            => $co2 ? round( $co2 ) : null,
				'bonusMalus'     => $row['bonusmalus'] ?? null,
				'price'          => array( 'current' => $row['prixvehicule'] ?? null ),
				'commercialized' => true,
				'updatedAt'      => $row['updatedat'] ?? null,
			)
		);
	}

	/**
	 * @param array $body Data Fair response.
	 * @return array[]
	 */
	private function results( array $body ): array {
		$lines = isset( $body['results'] ) && is_array( $body['results'] ) ? $body['results'] : array();

		return array_values( array_map( array( $this, 'map' ), array_filter( $lines, 'is_array' ) ) );
	}

	/**
	 * "Prix véhicule" and "_Prix_vehicule" both become "prixvehicule".
	 *
	 * @param string $key Column name.
	 * @return string
	 */
	private static function key( string $key ): string {
		$ascii = strtr(
			$key,
			array(
				'à' => 'a', 'â' => 'a', 'ä' => 'a', 'ç' => 'c', 'é' => 'e', 'è' => 'e', 'ê' => 'e', 'ë' => 'e',
				'î' => 'i', 'ï' => 'i', 'ô' => 'o', 'ö' => 'o', 'ù' => 'u', 'û' => 'u', 'ü' => 'u',
				'À' => 'a', 'Â' => 'a', 'Ç' => 'c', 'É' => 'e', 'È' => 'e', 'Ê' => 'e', 'Î' => 'i', 'Ô' => 'o', 'Û' => 'u',
			)
		);

		return (string) preg_replace( '/[^a-z0-9]/', '', strtolower( $ascii ) );
	}
}
