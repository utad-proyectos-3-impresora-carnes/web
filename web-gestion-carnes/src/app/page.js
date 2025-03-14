'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function Home() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const router = useRouter();
  const [rotation, setRotation] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const { clientX, clientY, currentTarget } = e;
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const x = ((clientX - left) / width - 0.5) * 40; // Mayor inclinación
    const y = ((clientY - top) / height - 0.5) * -40;
    setRotation({ x, y });
  };

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    const response = await fetch('/Dummies/user_credentials.json');
    if (!response.ok) {
      setError('Error loading credentials');
      return;
    }

    const data = await response.json();
    const user = data.users.find(u => u.username === email && u.password === password);

    if (user) {
      router.push('/dashboard'); // Redirigir a la página principal después del login
    } else {
      setError('Credenciales inválidas');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      {/* Header con Logo */}
      <header className="bg-[#0864ec] text-white py-6 px-8 w-full flex justify-between items-center fixed top-0 left-0 right-0 text-2xl shadow-lg">
        <img src="/LOGO_U.png" alt="Logo U-tad" className="h-10" /> 
      </header>

      {/* Espaciador para evitar solapamiento con el header */}
      <div className="mt-24"></div>

      {/* Contenedor Principal con más separación entre elementos */}
      <div className="flex justify-between items-center w-full max-w-[1100px] mt-10 px-16">
        {/* Carnet sin sombreado */}
        <motion.img
          src="/U-TAD_CENTRO_DIGITAL.png"
          alt="Carnet Universitario"
          className="w-[400px] h-auto object-contain"
          animate={{ rotateX: rotation.y, rotateY: rotation.x }}
          transition={{ type: "spring", stiffness: 70, damping: 10 }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        />

        {/* Contenedor de login */}
        <div className="flex flex-col items-center text-center">
          {/* Título separado con más tamaño */}
          <h2 className="text-5xl font-bold text-gray-800 mb-10">GESTOR CARNETS U-TAD</h2>
          <p className="text-gray-700 text-xl max-w-lg mb-12">
            Accede a tu cuenta para gestionar e imprimir carnets del alumnado de manera rápida y sencilla.
          </p>

          {/* Formulario de Login más centrado */}
          <div className="p-12 bg-white shadow-xl rounded-lg w-[500px]">
            <h3 className="text-3xl font-bold text-gray-800 text-center mb-6">INICIAR SESIÓN</h3>
            <form onSubmit={handleLogin}>
              <input
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                Entrar
              </button>
              {error && <p className="text-red-500 mt-4 text-center text-lg">{error}</p>}
            </form>

            {/* Enlace a Registro */}
            <p className="mt-6 text-gray-600 text-lg text-center">
              ¿No tienes cuenta? 
              <button onClick={() => router.push('/register')} className="text-[#0864ec] font-bold ml-1 hover:text-[#0648b3] transition">
                Regístrate
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
