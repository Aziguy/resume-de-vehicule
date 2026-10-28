<?php
/**
 * Normalized vehicle shape.
 *
 * @package ResumeVehicule
 */

namespace ResumeVehicule;

/**
 * Builds the provider agnostic vehicle array consumed by the block.
 */
final class Vehicle {

	/**
	 * Returns a complete vehicle array, unknown values set to null.
	 *
	 * @param array $data Partial vehicle data.
	 * @return array
	 */
	public static function normalize( array $data ): array {
		$dimensions = isset( $data['dimensions'] ) && is_array( $data['dimensions'] ) ? $data['dimensions'] : array();
		$price      = isset( $data['price'] ) && is_array( $data['price'] ) ? $data['price'] : array();

		return array(
			'id'             => isset( $data['id'] ) ? (string) $data['id'] : '',
			'source'         => self::text( $data['source'] ?? null ),
			'brand'          => self::text( $data['brand'] ?? null ),
			'model'          => self::text( $data['model'] ?? null ),
			'version'        => self::text( $data['version'] ?? null ),
			'energy'         => self::text( $data['energy'] ?? null ),
			'body'           => self::text( $data['body'] ?? null ),
			'gearbox'        => self::text( $data['gearbox'] ?? null ),
			'power'          => self::number( $data['power'] ?? null ),
			'weight'         => self::number( $data['weight'] ?? null ),
			'co2'            => self::number( $data['co2'] ?? null ),
			'maxSpeed'       => self::number( $data['maxSpeed'] ?? null ),
			'bonusMalus'     => self::text( $data['bonusMalus'] ?? null ),
			'dimensions'     => array(
				'length' => self::number( $dimensions['length'] ?? null ),
				'width'  => self::number( $dimensions['width'] ?? null ),
				'height' => self::number( $dimensions['height'] ?? null ),
			),
			'price'          => array(
				'base'    => self::number( $price['base'] ?? null ),
				'current' => self::number( $price['current'] ?? null ),
			),
			'commercialized' => isset( $data['commercialized'] ) ? (bool) $data['commercialized'] : null,
			'image'          => self::url( $data['image'] ?? null ),
			'updatedAt'      => self::date( $data['updatedAt'] ?? null ),
		);
	}

	/**
	 * Parses numbers, including French decimal notation ("96,000").
	 *
	 * @param mixed $value Raw value.
	 * @return float|int|null
	 */
	public static function number( $value ) {
		if ( is_int( $value ) || is_float( $value ) ) {
			return $value;
		}

		if ( ! is_string( $value ) ) {
			return null;
		}

		$value = str_replace( array( ' ', "\u{00a0}", ',' ), array( '', '', '.' ), trim( $value ) );

		if ( '' === $value || ! is_numeric( $value ) ) {
			return null;
		}

		return false === strpos( $value, '.' ) ? (int) $value : (float) $value;
	}

	/**
	 * @param mixed $value Raw value.
	 * @return string|null
	 */
	private static function text( $value ): ?string {
		if ( ! is_scalar( $value ) ) {
			return null;
		}

		$value = trim( (string) $value );

		return '' === $value ? null : $value;
	}

	/**
	 * @param mixed $value Raw value.
	 * @return string|null
	 */
	private static function url( $value ): ?string {
		$value = self::text( $value );

		return $value && preg_match( '#^https?://#i', $value ) ? $value : null;
	}

	/**
	 * @param mixed $value Raw value.
	 * @return string|null ISO 8601 date.
	 */
	private static function date( $value ): ?string {
		$value = self::text( $value );

		if ( null === $value ) {
			return null;
		}

		$time = strtotime( $value );

		return false === $time ? null : gmdate( 'c', $time );
	}
}
