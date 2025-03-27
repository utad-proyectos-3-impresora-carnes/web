"use server"

import callServer from "./callServer";
import { fetchToken } from "./tokenHandler";

export async function fetchAllMembersData(token: string): Promise<any[]> {

	const data: any[] = await callServer(
		"/api/member",
		token,
		{
			method: "GET",
		});
	return data;

}

export async function fetchFilteredMembersData(token: string, filters): Promise<any[]> {

	const data: any[] = await callServer(
		"/api/member/filtered",
		token,
		{
			method: "GET",
		});

	return data;
}
