'use client';

import { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const router = useRouter();


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
  
    try {

      if (typeof window === "undefined") return; // Evita ejecución en el servidor
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        throw new Error(result.message || "Error en el inicio de sesión");
      }
  
      // Guardar el token y el ID del usuario
      localStorage.setItem("token", result.token);
      localStorage.setItem("userID", result.user._id); // Guardar el _id correctamente
  
      setSuccess("Login exitoso");
      router.push("/dashboard"); // Redirige al dashboard
    } catch (error) {
      setError(error.message || "Error en el inicio de sesión");
    }
  };
  
  

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <form onSubmit={handleSubmit} className="p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-x1 text-gray-800 font-semibold mb-4">Login</h2>
        <input 
          type="text" 
          placeholder="Username" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          className="border p-2 rounded mb-2 w-full"
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          className="border p-2 rounded mb-2 w-full"
        />
        <div className="flex gap-4">
          <button type="button" onClick={() => router.push("/")} className="bg-gray-500 text-white px-4 py-2 rounded w-full">Home</button>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded w-full">Login</button>
        </div>        
        {error && <p className="text-red-500 mt-2">{error}</p>}
        {success && <p className="text-green-500 mt-2">{success}</p>}
      </form>
    </div>
  );
}