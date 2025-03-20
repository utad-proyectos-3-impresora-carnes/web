"use server"
export default async function callServer(url: string, options: RequestInit): Promise<any> {
	try {
		options.headers = {
			"Content-Type": "application/json",
			Authorization: `Bearer ${localStorage.getItem("token")}`,

		}
		return await fetch(url, options);
	} catch (error) {
		console.error(error);
		throw (error);
	}
}