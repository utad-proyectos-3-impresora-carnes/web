"use server";

import callServer from "./callServer";

export async function loginUser(email, password) {
    const data = await callServer(
        "/api/user/login",
        "",
        {
            method: "POST",
            body: JSON.stringify({ email, password }),
        }
    );

    return data;
}
