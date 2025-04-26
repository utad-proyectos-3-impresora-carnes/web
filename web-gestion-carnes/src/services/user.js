"use server";

import callServer from "./callServer";
import { getAuthToken } from "./tokenHandler";


/**
 * Hace log in de un usuario.
 * @param {string} email Email del usuario.
 * @param {string} password Contraseña del usuario.
 * @returns El usuario logeado.
 */
export async function loginUser(email, password) {

	try {

		return await callServer(
			"/api/user/login",
			await getAuthToken(),
			{
				method: "POST",
				body: JSON.stringify({ email, password })
			}
		);

	} catch (error) {
		console.error(error);
		throw new Error("Error al hacer login.");
	}

}

/**
 * Registra un usuario.
 * @param {string} email Email del usuario.
 * @param {string} password Contraseña del usuario.
 * @param {string} name El nombre del usuario.
 * @param {string} phone El teléfono del usuario.
 * @returns El usuario creado.
 */
export async function registerUser(email, password, name, phone) {

	try {

		return await callServer(
			"/api/user/register",
			await getAuthToken(),
			{
				method: "POST",
				body: JSON.stringify({ email, password, name, phone })
			}
		);

	} catch (error) {
		console.error(error);
		throw new Error("Error al registrar usuario.");
	}

}

/**
 * Obtiene el usuario por token.
 * @returns El usuario por token.
 */
export async function getUserByToken() {

	try {

		return await callServer(
			"/api/user/getUserByToken",
			await getAuthToken(),
			{
				method: "GET"
			}
		);

	} catch (error) {
		console.error(error);
		throw new Error("Error al obtener el usuario por token.");
	}

}

/**
 * Se edita el usuario.
 * @param {string} userId Id del usuario.
 * @param {Object} userData Nuevos datos del usuario.
 * @returns El usuario editado.
 */
export async function editUserById(userId, userData) {

	try {

		return await callServer(
			`/api/user/editUserById/${userId}`,
			await getAuthToken(),
			{
				method: "PATCH",
				body: JSON.stringify(userData)
			}
		);

	} catch (error) {
		console.error(error);
		throw new Error("Error al obtener el usuario por token.");
	}

}


