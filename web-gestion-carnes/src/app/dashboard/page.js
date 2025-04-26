"use client";

import { useState, useEffect } from "react";
import FilterSidebar from "@/components/filters";
import CarnetTable from "@/components/CarnetTable";
import Header from "@/components/header";
import { useRouter } from "next/navigation";
import { getAllMembers, getFilteredMembers } from "@/services/member";

export default function Page() {
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [filters, setFilters] = useState({});
	const [error, setError] = useState(null);
	const router = useRouter();
	const [selectedIds, setSelectedIds] = useState([]);

	useEffect(() => {
		if (typeof window === "undefined") return; // Evita ejecución en el servidor
		getAllMembers().then(res => {
			setData(res);
			setLoading(false);
		}).catch(error => router.push("/"));
	}, []);



	const handleApplyFilters = (filters) => {
		setFilters(filters);
		getFilteredMembers(filters).then(res => {
			setData(res);
			setLoading(false);
		}).catch(error => console.error);
	};



	return (
		<div className="h-screen w-full overflow-hidden">
			{error ? (
				<div className="flex h-screen items-center justify-center">
					<h1 className="text-3xl font-bold text-red-500">
						Error al cargar los datos.
					</h1>
				</div>
			) : (
				<>
					<Header selectedIds={selectedIds} />

					<div className="flex pt-16 h-[calc(100vh-4rem)] overflow-hidden">
						{/* Sidebar */}
						<aside className="w-64 h-full shrink-0 mt-8">
							<FilterSidebar onApply={handleApplyFilters} />
						</aside>

						{/* Contenido principal */}
						<main className="flex-1 overflow-y-auto px-0 mt-1">
							<CarnetTable data={data} loading={loading} selectedIds={selectedIds} setSelectedIds={setSelectedIds} />
						</main>

					</div>

				</>
			)}
		</div>
	);


}



