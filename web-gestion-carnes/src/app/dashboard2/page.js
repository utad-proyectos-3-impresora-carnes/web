"use client"

import { useState, useEffect } from "react";

import Header from "@/components/header";
import FilterSidebar from "@/components/FilterSiderbar";
import CarnetTable from "@/components/CarnetTable2";
import { getFilteredMembers } from "@/services/member";

/**
 * The dashboard page.
 * @returns Dahsboard page.
 */
export default function Page() {

	const [filters, setFilters] = useState({
		fullName: null,
		dni: null,
		group: null,
		year: null,
		printed: null,
		validationState: null
	});

	const [data, setData] = useState([]);

	const changeFilters = (category, value) => {
		setFilters(previousFilters => ({
			...previousFilters,
			[category]: value
		}));
	};

	useEffect(() => {

		getFilteredMembers(filters)
			.then((response) => {
				console.log(response);
			});

		// console.log(filters);

	}, [filters]);



	return (
		<div className="h-screen w-full overflow-hidden">
			<Header />
			<div className="flex pt-16 h-[calc(100vh-4rem)] overflow-hidden">
				{/* Sidebar */}
				<aside className="w-64 h-full shrink-0 mt-8">
					<FilterSidebar changeFilters={changeFilters} />
				</aside>

				{/* Contenido principal */}
				<main className="flex-1 overflow-y-auto px-0 mt-1">
					<CarnetTable data={data} />
				</main>
			</div>
		</div>
	);
}