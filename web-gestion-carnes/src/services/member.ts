import callServer from "./callServer";
const fetchMembersData = async () => {
	const token = localStorage.getItem("token");

	if (!token) {
		console.error("Error: No token found. Redirecting to login...");
		setError(true);
		setLoading(false);
		router.push("/");
		return;
	}

	try {
		const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/member`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		});

		if (!response.ok) {
			throw new Error(`Error ${response.status}: No se pudieron cargar los miembros`);
		}

		const data = await response.json();
		setData(data);
	} catch (error) {
		console.error("Error:", error);
		setError(true);

		if (error.message.includes("Token expirado")) {
			localStorage.removeItem("token");
			router.push("/");
		}
	} finally {
		setLoading(false);
	}
};
