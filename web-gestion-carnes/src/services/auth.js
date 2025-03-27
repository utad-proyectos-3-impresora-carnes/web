"use server"

import callServer from "./callServer";
import { fetchToken } from "./tokenHandler";

export async function auth()
{
    const token = fetchToken();
    if (!token) {
        return false;
    }

    const response = await callServer(
        "/api/user/getUserByToken",
        token,
        {
            method: "GET"
        }
    );

    if (response.ok) {
        return true;
    } else {
        return false;
    }    
}