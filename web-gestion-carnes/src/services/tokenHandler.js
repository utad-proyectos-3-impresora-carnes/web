"use server"

import { cookies } from 'next/headers'


/**
 * Obtiene el token del usuario.
 * @returns El token del usuario.
 */
export async function getAuthToken() {
	const cookieStore = await cookies();
	const userToken = cookieStore.get('userToken')?.value;
	return userToken;
}

/**
 * Sets the user token.
 * @param {string} token The user token
 */
export async function setAuthToken(token) {
	const cookieStore = await cookies();
	cookieStore.set("userToken", token);
}

/**
 * Deletes the user auth token.
 */
export async function deleteAuthToken() {
	const cookieStore = await cookies();
	cookieStore.delete("userToken");
}