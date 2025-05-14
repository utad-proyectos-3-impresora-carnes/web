"use client"
import { DataGrid } from '@mui/x-data-grid';
/**
 * Componente que muestra los carnets en una tabla.
 * @param {*} param0 
 */
export default function CarnetTable({ data, columns }) {

	const rows = [
		{ id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
		{ id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
		{ id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
		{ id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
		{ id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
		{ id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
		{ id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
		{ id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
		{ id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
		{ id: 10, lastName: 'Moxie', firstName: 'Harvey', age: 65 },
	];

	const paginationModel = { page: 0, pageSize: 10 };

	return (
		<div className="h-full rounded-xl border border-gray-300 shadow-md overflow-hidden relative">
			<DataGrid
				rows={rows}
				columns={columns}
				initialState={{ pagination: { paginationModel } }}
				checkboxSelection={false}
				sx={{ border: 0 }}
			/>
		</div>
	)
}