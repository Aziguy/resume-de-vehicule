import axios from "axios";

/**
 * Class representing an API error.
 * This class is used to represent errors when calling our API.
 */
class ApiError extends Error {
	/**
	 * Constructor of the ApiError class.
	 * @param {string} message - The error message.
	 */
	constructor(message) {
		super(message);
		this.name = this.constructor.name;
		Error.captureStackTrace(this, this.constructor);
	}
}

/**
 * Class for interacting with the vehicle API.
 * It provides methods for interacting with it.
 */
export default class VehicleApi {
	/**
	 * Makes a request to the API to get all vehicle data.
	 * @throws {ApiError} If an error occurs during the request.
	 * @returns {Promise<object[]>} A promise resolved with the vehicle data.
	 */
	static async getAllVehicles() {
		try {
			const response = await axios.get(
				"https://saabre-fake-api.osc-fr1.scalingo.io/cars/",
			);
			return response.data.data || [];
		} catch (error) {
			throw new ApiError("Error retrieving vehicle data");
		}
	}

	/**
	 * Makes a request to the API to get vehicle data by ID.
	 * @param {string} vehicleId - The ID of the vehicle to retrieve.
	 * @throws {ApiError} If an error occurs during the request.
	 * @returns {Promise<object>} A promise resolved with the vehicle data.
	 */
	static async getVehicleById(vehicleId) {
		try {
			const response = await axios.get(
				`https://saabre-fake-api.osc-fr1.scalingo.io/cars/${vehicleId}`,
			);
			return response.data || {};
		} catch (error) {
			throw new ApiError(`Error retrieving vehicle with ID ${vehicleId}`);
		}
	}
}
