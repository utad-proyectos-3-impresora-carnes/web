"use server";

import callServer from "./callServer";
import { fetchToken } from "./tokenHandler";

export async function fetchAllMembersData(token) {
	const data = await callServer(
		"/api/member/allMembers",
		token,
		{
			method: "GET",
		}
	);
	return data;
}

export async function fetchFilteredMembersData(token, filters) {
	const data = await callServer(
		"/api/member/filtered",
		token,
		{
			method: "GET",
		}
	);
	return data;
}
