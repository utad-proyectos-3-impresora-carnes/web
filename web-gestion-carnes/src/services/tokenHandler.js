"use server"

import { cookies } from 'next/headers'


/**
 * Obtiene el token del usuario.
 * @returns El token del usuario.
 */
export async function fetchToken() {
	const cookieStore = await cookies();
	const userToken = cookieStore.get('userToken')?.value;
	return userToken;
}

/**
 * Sets the user token.
 * @param {string} token The user token
 */
export async function setToken(token) {
	const cookieStore = await cookies();
	cookieStore.set("userToken", token);
}