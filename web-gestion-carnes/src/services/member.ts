"use client"

import callServer from "./callServer";
import { fetchToken } from "./tokenHandler";

export async function fetchAllMembersData(): Promise<any[]> {

	const data: any[] = await callServer(
		"/api/member",
		fetchToken(),
		{
			method: "GET",
		});

	return data;
}

export async function fetchFilteredMembersData(filters): Promise<any[]> {

	const data: any[] = await callServer(
		"/api/member/filtered",
		fetchToken(),
		{
			method: "GET",
		});

	return data;
}
