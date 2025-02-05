"use client"
import { useState } from "react";

// Ejemplo de como usar el servidor
async function sendQuery(contents) {

	const link = `${process.env.NEXT_PUBLIC_API_URL}${contents}`;
w
	console.log("CalliAskingng", link);

	return fetch(link);

}

export default function Home() {

	const [serverAnswer, setServerMessage] = useState("");

	// Ejemplo de como usar el servidor
	const askServer = (parameter) => {
		console.log("Sending param", parameter);
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
			<button className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5" onClick={() => askServer("")}>/</button>
			<button className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5" onClick={() => askServer("home")}>/home</button>
			<button className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5" onClick={() => askServer("test")}>/test</button>
			<button className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5" onClick={() => askServer("user")}>/user</button>
		</div>
	);
}
