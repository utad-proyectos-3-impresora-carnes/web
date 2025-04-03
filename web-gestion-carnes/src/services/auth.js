import callServer from "./callServer";
import { fetchToken } from "./tokenHandler";

export async function auth() {
    const token = fetchToken();
    if (!token) return false;
  
    try {
      const user = await callServer("/api/user/getUserByToken", token, { method: "GET" });
      return true;
    } catch (error) {
       if(Response.status === 500) {
        throw new Error("Error interno del servidor.");
    }
        
      return false;
    }
  }
  