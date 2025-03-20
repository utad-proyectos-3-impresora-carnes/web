"use server"

export default async function callServer(url: string, token: string, options: RequestInit): Promise<any> {
	try {
		options.headers = {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		}
		return await (await fetch(process.env.NEXT_PUBLIC_API_URL + url, options)).json();
	} catch (error) {
		console.error(error);
		throw (error);
	}
}
