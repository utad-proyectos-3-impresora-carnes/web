"use client"; // Correcto para mostrar UI interactiva

import { CircularProgress } from '@mui/material';

export default function Loading() {
	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-white">
			<CircularProgress size={40} thickness={4.5} />
			<p className="mt-4 text-gray-700 text-sm">Cargando la página...</p>
		</div>
	);
}
