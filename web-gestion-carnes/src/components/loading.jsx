"use client"; // Correcto para mostrar UI interactiva

import { CircularProgress } from '@mui/material/CircularProgress';

/**
 * This is a placeholder component to show an action is loading (usually when a query is sent to server).
 * @returns The loading component.
 */
export default function Loading({ loadingText = "Cargando la página..." }) {
	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-white">
			<CircularProgress size={40} thickness={4.5} />
			<p className="mt-4 text-gray-700 text-sm">{loadingText}</p>
		</div>
	);
}
