"use server"

/**
 * Generates a query to the server,
 * @param {string} url The url of the query.
 * @param {string} token The token for autenticathion.
 * @param {Object} options The options of the query.
 * @returns The query result
 */
export default async function callServer(url, token, options = {}) {

	try {

		// Adds headers
		options.headers = {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`
		}

		// Makes the query.
		const res = await fetch(process.env.NEXT_PUBLIC_API_URL + url, options);
		console.log("Llamando a la API: ", process.env.NEXT_PUBLIC_API_URL + url);

		// Si la query falla, lanza error.
		if (res.ok !== true) {
			throw new Error("La request a [" + url + "] fallo!" + "\n Detalles: " + res.statusText);
		}

		// Return query result.
		return await res.json();

	} catch (error) {

		console.error(error);

		// Throw error upstream to handle case by case.
		throw (error);

	}
}
