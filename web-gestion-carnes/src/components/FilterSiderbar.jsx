"use client"

import { ChevronDown } from "@deemlol/next-icons";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * El componente con los filtros de los carnes.
 * @param {*} param0 Funcion para actualizar los filtros.
 * @returns Componente con los filtros.
 */
export default function FilterSidebar({ changeFilters }) {
	return (
		<div className="w-64 text-white px-0 py-5 fixed top-16 left-0 bottom-0 overflow-y-auto ml-[-4px] mt-[-15px]">
			<div className="flex flex-col">
				<CommonFilterPannel filterTitle={"Titulación"} filterContents={<GroupFilter />} />
				<CommonFilterPannel filterTitle={"Estado"} filterContents={<ValidationStateFilter />} />
				<CommonFilterPannel filterTitle={"Año Académico"} filterContents={<AcademicYearFilter />} />
				<CommonFilterPannel filterTitle={"Impreso"} filterContents={<PrintedStateFilter />} />
			</div >
		</div >
	);
}

/**
 * Parte genérica de un filtro.
 * @returns Componente con el envoltorio de un filtro.
 */
function CommonFilterPannel({ filterTitle, filterContents }) {

	const [shownFilter, setShownFilter] = useState(false);

	const changeFilterVisibility = () => {
		setShownFilter(!shownFilter.valueOf());
	}

	const sectionWrapperStyle = "bg-[#101426] text-white border border-white rounded-md overflow-hidden";
	const sectionButtonStyle = "w-full flex justify-between items-center px-4 py-4 text-base font-medium";

	const chevronStyle = (open) => `w-5 h-5 transition-transform duration-300 ${open ? "rotate-180" : ""}`;

	return (
		<div className={sectionWrapperStyle}>
			<button onClick={changeFilterVisibility} className={sectionButtonStyle}>
				{filterTitle}
				<ChevronDown className={chevronStyle(shownFilter)} />
			</button>
			<AnimatePresence initial={false}>
				{shownFilter && (
					<motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="pb-4">
						{filterContents}
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}


function CommonFilterOption() {
	const labelStyle = "flex items-center space-x-3 py-2 pl-5 text-[15px] text-white";
	const radioStyle = "w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500";
	return {/* {loading ? (
							<p className="text-gray-400 pl-5 text-sm">Cargando...</p>
						) : (
							titulaciones.map((t) => (
								<label key={t._id} className={labelStyle}>
									<input
										type="radio"
										className={radioStyle}
										name="titulacion"
										checked={selected.group === t.name}
										onChange={() => handleChange("group", t.name)}
									/>
									<span>{t.name}</span>
								</label>
							))
						)} */}
}

function GroupFilter() {
	return (
		<div></div>
	);
}

function ValidationStateFilter() {
	return (
		<div></div>
	);
}

function AcademicYearFilter() {
	return (
		<div></div>
	);
}

function PrintedStateFilter() {
	return (
		<div></div>
	);
}