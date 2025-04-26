'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { loginUser } from '../services/user';
import { auth } from '@/services/auth';
import Loading from '@/components/loading';
import { setAuthToken } from '@/services/tokenHandler';

export default function Login() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [checkingAuth, setCheckingAuth] = useState(true);
	const [error, setError] = useState(null);
	const router = useRouter();
	const [rotation, setRotation] = useState({ x: 0, y: 0 });

	useEffect(() => {
		const check = async () => {
			try {
				await auth();
				setCheckingAuth(false);
				router.push('/dashboard');
			} catch (error) {
				setCheckingAuth(false);

			}
		}

		check();
	}, [router]);

	const handleMouseMove = (e) => {
		const { clientX, clientY, currentTarget } = e;
		const { left, top, width, height } = currentTarget.getBoundingClientRect();
		const x = ((clientX - left) / width - 0.5) * 40;
		const y = ((clientY - top) / height - 0.5) * -40;
		setRotation({ x, y });
	};

	const handleMouseLeave = () => {
		setRotation({ x: 0, y: 0 });
	};

	const handleLogin = async (e) => {
		e.preventDefault();
		setError(null);

		try {
			const data = await loginUser(email, password);
			await setAuthToken(data.token);
			router.push('/dashboard');
		} catch (error) {
			setError(error.message || 'Ha ocurrido un error.');
		}
	};

	if (checkingAuth) return <Loading />;

	return (
		<div className="min-h-screen bg-gray-200 flex flex-col items-center justify-center">
			<div className="flex justify-between items-center w-full max-w-[1100px] mt-10 px-16">
				<motion.img
					src="/U-TAD_CENTRO_DIGITAL.png"
					alt="Carnet Universitario"
					className="w-[400px] h-auto object-contain"
					animate={{ rotateX: rotation.y, rotateY: rotation.x }}
					transition={{ type: "spring", stiffness: 70, damping: 10 }}
					onMouseMove={handleMouseMove}
					onMouseLeave={handleMouseLeave}
				/>

				<div className="flex flex-col items-center text-center">
					<h2 className="text-5xl font-bold text-gray-800 mb-10">GESTOR CARNETS U-TAD</h2>
					<p className="text-gray-700 text-xl max-w-lg mb-12">
						Accede a tu cuenta para gestionar e imprimir carnets del alumnado de manera rápida y sencilla.
					</p>

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
