'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleRegister = (e) => {
    e.preventDefault();
    setError(null);

    // Validar que los correos coincidan
    if (email !== confirmEmail) {
      setError('Los correos electrónicos no coinciden.');
      return;
    }

    console.log('Registrando usuario:', { name, email, password });

    // Redirigir al login después del registro
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <header className="bg-[#0864ec] text-white py-4 px-6 w-full flex justify-between items-center fixed top-0 left-0 right-0">
        <h1 className="text-xl font-bold">U-tad</h1>
      </header>

      {/* Espaciador para evitar solapamiento con el header */}
      <div className="mt-16"></div>

      {/* Contenido de Registro */}
      <div className="flex flex-col items-center mt-10">
        <h2 className="text-3xl font-bold text-gray-800">Registro</h2>

        <form onSubmit={handleRegister} className="mt-6 p-6 bg-white shadow-lg rounded-lg w-96">
          <input
            type="text"
            placeholder="Nombre completo"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-2 rounded w-full mb-2"
            required
          />
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 rounded w-full mb-2"
            required
          />
          <input
            type="email"
            placeholder="Confirmar correo electrónico"
            value={confirmEmail}
            onChange={(e) => setConfirmEmail(e.target.value)}
            className="border p-2 rounded w-full mb-2"
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 rounded w-full mb-2"
            required
          />
          <button type="submit" className="bg-[#0864ec] text-white px-4 py-2 rounded w-full mt-2">
            Registrarse
          </button>
          {error && <p className="text-red-500 mt-2 text-center">{error}</p>}
        </form>

        <p className="mt-4 text-gray-600">¿Ya tienes cuenta?
          <button onClick={() => router.push('/')} className="text-[#0864ec] font-bold ml-1">
            Inicia sesión
          </button>
        </p>
      </div>
    </div>
  );
}
