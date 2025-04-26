"use server";

import callServer from "./callServer";
import { getAuthToken } from "./tokenHandler";

/**
 * Gets the groups metadata.
 * @returns The groups metadata.
 */
export async function getGroupMetadata() {

	try {

		return await callServer(
			"/api/group/metadata",
			await getAuthToken(),
			{
				method: "GET"
			}
		);

	} catch (error) {
		console.error(error);
		throw new Error("Error al obtener los metadatos de los grupos");
	}
}

/**
 * Obtiene todos los grupos de la base de datos.
 * @returns Todos los grupos en la base de datos.
 */
export async function getAllGroups() {

	try {

		return await callServer(
			"/api/group/allGroups",
			await getAuthToken(),
			{
				method: "GET"
			}
		);

	} catch (error) {
		console.error(error);
		throw new Error("Error al obtener todos los grupos.")
	}
}

/**
 * Obtiene los grupos que pase el filtro.
 * @returns Los grupos filtrados.
 */
export async function getFilteredGroups(filters) {

	try {

		return await callServer(
			"/api/group/filtered",
			await getAuthToken(),
			{
				method: "GET",
				body: JSON.stringify(filters)
			}
		);

	} catch (error) {
		console.error(error);
		throw new Error("Error al obtener los grupos filtrados.");
	}
}

