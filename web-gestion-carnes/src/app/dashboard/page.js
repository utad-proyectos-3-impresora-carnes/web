"use client";

import { useState, useEffect } from "react";
import FilterSidebar from "@/components/filters";
import Table from "@/components/table";
import Header from "@/components/header";
import { useRouter } from "next/navigation";
import { fetchAllMembersData } from "@/services/member";

export default function Page() {
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [filters, setFilters] = useState({});
	const [error, setError] = useState(null);
	const router = useRouter();

	useEffect(() => {
		if (typeof window === "undefined") return; // Evita ejecución en el servidor
		fetchAllMembersData().then(res => {
			setData(res);
			setLoading(false);
		}).catch(error => console.error(error));
	}, []);



	const handleApplyFilters = (filters) => {
		setFilters(filters);
		// Aquí podrías filtrar `data` según los filtros aplicados
	};



	return (
		<div className="h-screen w-full">
			{error ? (
				<div className="flex h-screen items-center justify-center">
					<h1 className="text-3xl font-bold text-red-500">
						Error al cargar los datos.
					</h1>
				</div>
			) : (
				<>
					{/* Header fijo en la parte superior */}
					<Header />

					{/* Contenedor principal con Sidebar a la izquierda y Tabla a la derecha */}
					<div className="flex pt-1 h-full">
						{/* Sidebar de filtros a la izquierda */}
						<aside className="w-1/4 bg-gray-100 p-4 h-full">
							<FilterSidebar onApply={handleApplyFilters} />
						</aside>

						{/* Contenedor de la tabla */}
						<main className="flex-1 p-6">
							<Table data={data} loading={loading} />
						</main>
					</div>
				</>
			)}
		</div>
	);

}



