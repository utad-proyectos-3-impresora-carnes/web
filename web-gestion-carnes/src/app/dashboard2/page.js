"use client"

import { useState, useEffect } from "react";

import Header from "@/components/header";
import FilterSidebar from "@/components/FilterSiderbar";

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

	const changeFilters = (category, value) => {
		setFilters(previousFilters => ({
			...previousFilters,
			[category]: value
		}));
	}

	useEffect(() => {

		console.log(filters);

	}, [filters])



	return (
		<div className="h-screen w-full overflow-hidden">
			<Header />
			<p>Dashboard two!</p>
			<div className="flex pt-16 h-[calc(100vh-4rem)] overflow-hidden">
				{/* Sidebar */}
				<aside className="w-64 h-full shrink-0 mt-8">
					<FilterSidebar changeFilters={changeFilters} />
				</aside>
			</div>
		</div>
	);
}