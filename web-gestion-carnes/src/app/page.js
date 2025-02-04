"use client"
import Image from "next/image";
import { useState } from "react";
import { config } from "dotenv";

config();

// Ejemplo de como usar el servidor
async function sendQuery(contents) {
	return fetch(`${process.env.API_URL}/${contents}`);
}

export default function Home() {

	const [serverMessage, setServerMessage] = useState("");

	// Ejemplo de como usar el servidor
	const askServer = (parameter) => {
		sendQuery(parameter).then((result) => {
			const text = result.text();
			text.then((plainText) => {
				setServerAnswer(plainText);
			})
		})
	}

	return (
		<div>
		<h1>Da printer app!</h1>
		<p>The server says {serverAnswer}</p>
		<button onClick={() => askServer("/")}>/</button>
		<button onClick={() => askServer("/home")}>/home</button>
		<button onClick={() => askServer("/test")}>/test</button>
		<button onClick={() => askServer("/user")}>/user</button>
	</div>
	);
}
