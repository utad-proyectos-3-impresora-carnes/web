"use server"

export default async function callServer(url, token, options = {}) {
	try {
		options.headers = {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`
		}

		const res = await fetch(process.env.NEXT_PUBLIC_API_URL + url, options);

		if (res.status === 200 || res.status === 201) {
			return await res.json();
		} else {
			console.log(res)
			throw new Error("La request a [" + url + "] fallo!");
		}
	} catch (error) {
		console.error(error);
		throw (error);
	}
}
