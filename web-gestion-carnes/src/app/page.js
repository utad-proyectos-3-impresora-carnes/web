"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

// Función para enviar consultas al servidor
async function sendQuery(contents) {
    const link = `${process.env.NEXT_PUBLIC_API_URL}${contents}`;
    console.log("Breaking", link);
    return fetch(link);
}

export default function Home() {
    const [serverAnswer, setServerMessage] = useState("");
    const router = useRouter();

    // Función para hacer una consulta al servidor
    const askServer = (parameter) => {
        console.log("Sending param", parameter);
        sendQuery(parameter).then((result) => {
            const text = result.text();
            text.then((plainText) => {
                setServerMessage(plainText);
            });
        });
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <header className="bg-[#0864ec] text-white py-4 px-6 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <h1 className="text-xl font-bold">U-tad</h1>
                </div>
                <nav className="flex gap-4">
                    <button onClick={() => router.push("/")} className="hover:underline">Inicio</button>
                    <button onClick={() => router.push("/login")} className="hover:underline">Login</button>
                    <button onClick={() => router.push("/registro")} className="hover:underline">Registro</button>
                </nav>
            </header>

            {/* Hero Section */}
            <main className="flex flex-col items-center justify-center text-center py-16 px-6">
                <h2 className="text-3xl font-bold text-gray-800">Impresión de carnets</h2>
                <p className="text-gray-600 mt-4 max-w-lg">
                    Gestiona e imprime carnets de manera rápida y sencilla.
                </p>
                <div className="mt-6 w-64 h-96 bg-white shadow-lg rounded-lg flex items-center justify-center border">
                </div>
            </main>

            {/* Acerca de */}
            <section className="bg-white py-10 text-center">
                <h3 className="text-2xl font-semibold text-gray-800">Acerca de</h3>
                <p className="text-gray-600 mt-2"></p>
            </section>
        </div>
    );
}
