<?php
/**
 * Vehicle data provider contract.
 *
 * @package ResumeVehicule
 */

namespace ResumeVehicule\Providers;

/**
 * A provider returns vehicles normalized with Vehicle::normalize().
 */
interface ProviderInterface {

	/**
	 * Unique identifier.
	 */
	public function id(): string;

	/**
	 * Human readable name.
	 */
	public function label(): string;

	/**
	 * Searches vehicles.
	 *
	 * @param string $term  Free text, empty for the first results.
	 * @param int    $limit Maximum number of results.
	 * @return array[]
	 * @throws ProviderException On failure.
	 */
	public function search( string $term, int $limit ): array;

	/**
	 * Finds a vehicle by identifier.
	 *
	 * @param string $id Vehicle identifier.
	 * @return array|null
	 * @throws ProviderException On failure.
	 */
	public function find( string $id ): ?array;
}
