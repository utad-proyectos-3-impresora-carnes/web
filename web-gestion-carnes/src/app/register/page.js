'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleRegister = (e) => {
    e.preventDefault();
    setError(null);

    if (email !== confirmEmail) {
      setError('Los correos electrónicos no coinciden.');
      return;
    }

    const requestBody = JSON.stringify({ email, password, phone });
    console.log("Datos enviados a la API:", requestBody);

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, phone }),
    })
      .then(async (res) => {
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || 'Ha ocurrido un error.');
        }

        localStorage.setItem('token', data.token);
        router.push('/dashboard');
      })
      .catch((error) => {
        setError(error.message || 'Ha ocurrido un error.');
      });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      {/* Header con Logo */}
      <header className="bg-[#0864ec] text-white py-6 px-8 w-full flex justify-between items-center fixed top-0 left-0 right-0 text-2xl shadow-lg">
        <img src="/LOGO_U.png" alt="Logo U-tad" className="h-10" />
      </header>

      {/* Espaciador para evitar solapamiento con el header */}
      <div className="mt-24"></div>

      {/* Contenido de Registro */}
      <div className="flex flex-col items-center">
        <div className="p-10 bg-white shadow-xl rounded-lg w-[500px]">
          <h3 className="text-3xl font-bold text-gray-800 text-center mb-6">REGISTRO</h3>
          <form onSubmit={handleRegister}>
            <input
              type="text"
              placeholder="Nombre completo"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border p-3 text-lg rounded w-full mb-4 focus:ring-2 focus:ring-blue-500 transition"
              required
            />
            <input
              type="tel"
              placeholder="Teléfono"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="border p-3 text-lg rounded w-full mb-4 focus:ring-2 focus:ring-blue-500 transition"
              required
              />
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border p-3 text-lg rounded w-full mb-4 focus:ring-2 focus:ring-blue-500 transition"
              required
            />
            <input
              type="email"
              placeholder="Confirmar correo electrónico"
              value={confirmEmail}
              onChange={(e) => setConfirmEmail(e.target.value)}
              className="border p-3 text-lg rounded w-full mb-4 focus:ring-2 focus:ring-blue-500 transition"
              required
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border p-3 text-lg rounded w-full mb-4 focus:ring-2 focus:ring-blue-500 transition"
              required
            />
            <button type="submit" className="bg-[#0864ec] text-white px-6 py-3 rounded w-full text-lg font-semibold mt-4 hover:bg-blue-700 transition">
              CREAR CUENTA
            </button>
            {error && <p className="text-red-500 mt-4 text-center text-lg">{error}</p>}
          </form>

          {/* Enlace a Inicio de Sesión */}
          <p className="mt-6 text-gray-600 text-lg text-center">
            ¿Ya tienes cuenta? 
            <button onClick={() => router.push('/')} className="text-[#0864ec] font-bold ml-1 hover:text-[#0648b3] transition">
              Inicia sesión
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}