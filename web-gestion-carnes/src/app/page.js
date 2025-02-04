"use client"
import { useState } from "react";

// Ejemplo de como usar el servidor
async function sendQuery(contents) {
	return fetch(`${process.env.NEXT_PUBLIC_API_URL}${contents}`);
}

export default function Home() {

	const [serverAnswer, setServerMessage] = useState("");

	// Ejemplo de como usar el servidor
	const askServer = (parameter) => {
		sendQuery(parameter).then((result) => {
			const text = result.text();
			text.then((plainText) => {
				setServerMessage(plainText);
			})
		})
	}

	return (
		<div>
		<h1>Da printer app!</h1>
		<p>The server says {serverAnswer}</p>
		<button onClick={() => askServer("")}>/</button>
		<button onClick={() => askServer("home")}>/home</button>
		<button onClick={() => askServer("test")}>/test</button>
		<button onClick={() => askServer("user")}>/user</button>
	</div>
	);
}
