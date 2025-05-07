"use server";

import callServer from "./callServer";
import { getAuthToken } from "./tokenHandler";

/**
 * Gets the members metadata.
 * @returns The metadata of the members.	
 */
export async function getGroupMetadata() {

	try {

		return await callServer(
			"/api/member/metadata",
			await getAuthToken(),
			{
				method: "GET"
			}
		);

	} catch (error) {
		console.error(error);
		throw new Error("Error al obtener los metadatos de los miembros.");
	}
}

/**
 * Obtiene todos los miembros de la base de datos.
 * @returns Todos los miembros en la base de datos.
 */
export async function getAllMembers() {

	try {

		return await callServer(
			"/api/member/allMembers",
			await getAuthToken(),
			{
				method: "GET"
			}
		);

	} catch (error) {
		console.error(error);
		throw new Error("Error al obtener todos los miembros.");
	}
}

/**
 * Devuelve los miembros que cumplan los filtros.
 * @param {Object} filters Los filtros de los miembros.
 * @returns Los miembros que cumplan los filtros.
 */
export async function getFilteredMembers(filters) {
	try {
		const queryParams = new URLSearchParams();

		// Armamos los filtros en la URL
		Object.entries(filters).forEach(([key, value]) => {
			if (value !== null && value !== "" && value !== undefined) {
				queryParams.append(key, value);
			}
		});

		const url = `/api/member/filtered?${queryParams.toString()}`;

		return await callServer(
			url,
			await getAuthToken(),
			{
				method: "GET",
				headers: {
					"accept": "application/json"
				}
			}
		);
	} catch (error) {
		console.error(error);
		throw new Error("Error al obtener los miembros filtrados.");
	}
}

/**
 * Obtiene el link a la imagen de la previsualización del miembro.
 * @param {string} memberId El id del miembro.
 * @returns El link a la imagen de la previsualización del miembro.
 */
export async function getCardPreview(memberId) {

	try {

		return await callServer(
			`/api/member/preview/${memberId}`,
			await getAuthToken(),
			{
				method: "GET"
			}
		);


	} catch (error) {
		console.error(error);
		throw new Error("Error al obtener la previsualización de un miembro.");
	}
}

/**
 * Ediat el estado de validación de un miembro.
 * @param {string} memberId El id del miembro.
 * @param {string} validationState El estado de validación.
 * @returns El miembro editado.
 */
export async function editMemberValidatioStatus(memberId, validationState) {

	try {

		return await callServer(
			`/api/member/editMemberValidatioStatus/${memberId}`,
			await getAuthToken(),
			{
				method: "PATCH",
				body: JSON.stringify({ validationState: validationState })
			}
		);


	} catch (error) {
		console.error(error);
		throw new Error("Error al editar el estado de validación de un miembro.");
	}
}

/**
 * Manda a imprimri una serie de miembros.
 * @param {Array<String>} members Los ids de los miembros a imprimir.
 * @returns Un aviso de si los miembros se pusieron a la cola de imprimir.
 */
export async function printMembers(members) {

	try {

		return await callServer(
			`/api/member/printMembers`,
			await getAuthToken(),
			{
				method: "PATCH",
				body: JSON.stringify(members)
			}
		);


	} catch (error) {
		console.error(error);
		throw new Error("Error al manda a imprimir miembros");
	}

}