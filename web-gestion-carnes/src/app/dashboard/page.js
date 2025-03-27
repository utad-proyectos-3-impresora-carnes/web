"use client";

import { useState, useEffect } from "react";
import FilterSidebar from "@/components/filters";
import CarnetTable from "@/components/CarnetTable";
import Header from "@/components/header";
import { useRouter } from "next/navigation";
import { fetchAllMembersData, fetchFilteredMembersData } from "@/services/member";
import { fetchToken } from "@/services/tokenHandler";

export default function Page() {
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [filters, setFilters] = useState({});
	const [error, setError] = useState(null);
	const router = useRouter();

	useEffect(() => {
		if (typeof window === "undefined") return; // Evita ejecución en el servidor
		fetchAllMembersData(fetchToken()).then(res => {
			setData(res);
			setLoading(false);
		}).catch(error => console.error(error));
	}, []);



	const handleApplyFilters = (filters) => {
		setFilters(filters);
		fetchFilteredMembersData(fetchToken(), filters).then(res => {
			setData(res);
			setLoading(false);
		}).catch(error => console.error);
	};



	return (
		<div className="h-screen w-full overflow-hidden mt-2">
		  {error ? (
			<div className="flex h-screen items-center justify-center">
			  <h1 className="text-3xl font-bold text-red-500">
				Error al cargar los datos.
			  </h1>
			</div>
		  ) : (
			<>
			  <Header />
	  
			  <div className="flex pt-16 h-[calc(100vh-4rem)] overflow-hidden">
				{/* Sidebar ya forma parte del flujo */}
				<aside className="w-64 h-full shrink-0">
					<FilterSidebar onApply={handleApplyFilters} />
				</aside>

				{/* Contenido principal */}
				<main className="flex-1 overflow-y-auto px-0 mr-[-22px]">
					<CarnetTable data={data} loading={loading} />
				</main>
			
			</div>

			</>
		  )}
		</div>
	  );
	  

}



