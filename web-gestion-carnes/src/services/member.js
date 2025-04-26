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
			getAuthToken(),
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
			getAuthToken(),
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

		return await callServer(
			"/api/member/filtered",
			getAuthToken(),
			{
				method: "GET",
				body: JSON.stringify(filters)
			}
		);


	} catch (error) {
		console.error(error);
		throw new Error("Error al obtener los miembros filtrados.");
	}
}
