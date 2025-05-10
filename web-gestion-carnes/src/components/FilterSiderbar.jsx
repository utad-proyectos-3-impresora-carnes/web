"use client"

import { ChevronDown } from "@deemlol/next-icons";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getAllGroups } from "@/services/group";

/**
 * El componente con los filtros de los carnes.
 * @param {*} param0 Funcion para actualizar los filtros.
 * @returns Componente con los filtros.
 */
export default function FilterSidebar({ changeFilters }) {

	const changeGroupValue = (groupId) => {
		changeFilters("group", groupId);
	}

	return (
		<div className="w-64 text-white px-0 py-5 fixed top-16 left-0 bottom-0 overflow-y-auto ml-[-4px] mt-[-15px]">
			<div className="flex flex-col">
				<CommonFilterPannel filterTitle={"Titulación"} filterContents={<GroupFilter changeGroupValue={changeGroupValue} />} />
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

/**
 * Common option picker for the filters.
 * @returns Component to pick options in the filters
 */
function CommonFilterOption({ id, name, value, selected, onChange }) {
	const labelStyle = "flex items-center space-x-3 py-2 pl-5 text-[15px] text-white";
	const radioStyle = "w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500";
	return (

		<label key={id} className={labelStyle}>
			<input
				type="radio"
				className={radioStyle}
				checked={selected === value}
				onChange={onChange}
			/>
			<span>{name}</span>
		</label>

	);
}

function GroupFilter({ changeGroupValue }) {

	const [groups, setGroups] = useState([]);
	const [loading, setLoading] = useState(true)
	const [selectedGroup, setSelectedGroup] = useState(null);

	const updateGroups = (newGroups) => {
		setGroups(newGroups);
	}

	useEffect(() => {
		getAllGroups()
			.then(groups => {
				setLoading(false)
				updateGroups(groups)
			})
			.catch((err) => {
				console.error(err);
			});
	}, []);

	useEffect(() => {
		console.log(selectedGroup)
		changeGroupValue(selectedGroup);
	}, [selectedGroup])

	return (
		<>
			{
				loading ?
					(<p className="text-gray-400 pl-5 text-sm" > Cargando...</p>)
					: groups.map(group => {
						return (
							<CommonFilterOption id={group._id} name={group.name} value={group._id} selected={selectedGroup} onChange={() => setSelectedGroup(group._id)} />
						)
					})
			}
		</>);
}

function ValidationStateFilter({ changeValidationStateValue }) {
	return (
		<div></div>
	);
}

function AcademicYearFilter({ changeAcademicYearValue }) {
	return (
		<div></div>
	);
}

function PrintedStateFilter({ changePrintedStateValue }) {
	return (
		<div></div>
	);
}