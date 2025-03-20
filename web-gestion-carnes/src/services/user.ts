"use server"

import callServer from "./callServer";


export async function loginUser(email, password): Promise<any> {

    const data: any = await callServer(
        "/api/user/login",
        "",
        {
            method: "POST",
            body: JSON.stringify({ email, password }),
        });

    return data;


}