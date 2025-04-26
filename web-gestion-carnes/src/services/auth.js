import { getUserByToken } from "./user";

/**
 * Checks if token is valid
 * @returns True if token is valid, error if not.
 */
export async function auth() {

	try {

		await getUserByToken();
		return true;

	} catch (error) {

		throw (error);

	}
}
