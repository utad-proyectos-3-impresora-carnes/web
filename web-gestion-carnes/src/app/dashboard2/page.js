"use client"

import { useState, useEffect } from "react";

import Header from "@/components/header";
import FilterSidebar from "@/components/FilterSiderbar";
import CarnetTable from "@/components/CarnetTable2";
import { getFilteredMembers } from "@/services/member";

import styles from "@/styles/CardTable.module.css"

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

	const [columns,] = useState([
		{
			field: 'id',
			headerName: 'ID',
			width: 70,
			headerClassName: styles.tableHeader,
		},
		{
			field: 'firstName',
			headerName: 'First name',
			width: 130,
			headerClassName: 'bg-[#0D122B] text-white font-bold',
		},
		{
			field: 'lastName',
			headerName: 'Last name',
			width: 130,
			filterable: false,
			headerClassName: 'bg-[#0D122B] text-white font-bold',
		},
		{
			field: 'age',
			headerName: 'Age',
			type: 'number',
			width: 90,
			headerClassName: 'bg-[#0D122B] text-white font-bold text-center',
		},
		{
			field: 'fullName',
			headerName: 'Full name',
			description: 'This column has a value getter and is not sortable.',
			sortable: false,
			width: 160,
		}
	]);

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
			<div className="flex pt-16 h-[calc(104.5vh-4rem)] overflow-hidden">
				{/* Sidebar */}
				<aside className="w-64 h-full shrink-0 mt-8">
					<FilterSidebar changeFilters={changeFilters} />
				</aside>

				{/* Contenido principal */}
				<main className="flex-1 overflow-y-auto px-0 mt-1">
					<CarnetTable data={data} columns={columns} />
				</main>
			</div>
		</div>
	);
}