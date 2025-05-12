"use client"

import { ChevronDown } from "@deemlol/next-icons";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getAllGroups } from "@/services/group";
import { getMemberMetadata } from "@/services/member";

/**
 * Sidebar component for filtering meat-related records.
 * @param {function} changeFilters - Callback to update the applied filters.
 * @returns JSX for the filter sidebar.
 */
export default function FilterSidebar({ changeFilters }) {

	// Handlers for updating each filter type
	const handleGroupChange = (groupId) => changeFilters("group", groupId);
	const handleValidationStateChange = (state) => changeFilters("validationState", state);
	const handleAcademicYearChange = (year) => changeFilters("year", year);
	const handlePrintedStateChange = (printed) => changeFilters("printed", printed);

	return (
		<div className="w-64 text-white px-0 py-5 fixed top-16 left-0 bottom-0 overflow-y-auto ml-[-4px] mt-[-15px]">
			<div className="flex flex-col">
				<CommonFilterPannel
					filterTitle="Titulación"
					filterContents={<GroupFilter changeGroupValue={handleGroupChange} />}
				/>
				<CommonFilterPannel
					filterTitle="Estado"
					filterContents={<ValidationStateFilter changeValidationStateValue={handleValidationStateChange} />}
				/>
				<CommonFilterPannel
					filterTitle="Año Académico"
					filterContents={<AcademicYearFilter changeAcademicYearValue={handleAcademicYearChange} />}
				/>
				<CommonFilterPannel
					filterTitle="Impreso"
					filterContents={<PrintedStateFilter changePrintedStateValue={handlePrintedStateChange} />}
				/>
			</div>
		</div>
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
				onClick={onChange}
			/>
			<span>{name}</span>
		</label>

	);
}

/**
 * Componnet to filter by groups.
 * @param {*} param0 
 * @returns 
 */
function GroupFilter({ changeGroupValue }) {

	const [groups, setGroups] = useState([]);
	const [loading, setLoading] = useState(true)
	const [selectedGroup, setSelectedGroup] = useState(null);

	useEffect(() => {
		getAllGroups()
			.then(groups => {
				setLoading(false)
				setGroups(groups)
			})
			.catch((err) => {
				console.error(err);
			});
	}, []);

	useEffect(() => {
		changeGroupValue(selectedGroup);
	}, [selectedGroup])

	return (
		<>
			{
				loading ?
					(<p className="text-gray-400 pl-5 text-sm" > Cargando...</p>)
					: groups.map(group => {
						return (
							<CommonFilterOption
								id={group._id}
								name={group.name}
								value={group._id}
								selected={selectedGroup}
								onChange={() => {
									if (selectedGroup !== group._id) {
										setSelectedGroup(group._id)
									} else {
										setSelectedGroup(null)
									}
								}} />
						)
					})
			}
		</>
	);
}

/**
 * Component to filter by validation state
 * @param {*} param0 
 * @returns 
 */
function ValidationStateFilter({ changeValidationStateValue }) {

	const [validationStates, setValidationStates] = useState([]);
	const [loading, setLoading] = useState(true)
	const [selectedValidationState, setSelectedValidationState] = useState(null);

	useEffect(
		() => {
			getMemberMetadata()
				.then((metadata) => {
					if (metadata?.validationStates) {
						setValidationStates(metadata.validationStates);
						setLoading(false);
					}
				})
				.catch((err) => {
					console.error(err);
				});
		}, []
	);

	useEffect(() => {
		changeValidationStateValue(selectedValidationState);
	}, [selectedValidationState]);

	return (
		<>
			{
				loading ?
					(<p className="text-gray-400 pl-5 text-sm" > Cargando...</p>)
					: validationStates.map(validationState => {
						return (
							<CommonFilterOption
								id={validationState.toUpperCase()}
								name={validationState.toUpperCase()}
								value={validationState.toUpperCase()}
								selected={selectedValidationState}
								onChange={() => {
									if (selectedValidationState !== validationState.toUpperCase()) {
										setSelectedValidationState(validationState.toUpperCase())
									} else {
										setSelectedValidationState(null)
									}
								}} />
						)
					})
			}
		</>
	);
}

/**
 * Component to filter by year.
 * @param {*} param0 
 * @returns 
 */
function AcademicYearFilter({ changeAcademicYearValue }) {

	const [selectedYear, setSelectedSelectedYear] = useState(null);
	const [currentYear,] = useState(new Date().getFullYear().toString());
	const [customYearOpen, setCustomYearOpen] = useState(false);
	const customYearName = "Otro";

	return (
		<>
			<CommonFilterOption
				id={currentYear}
				name={currentYear}
				value={currentYear}
				selected={selectedYear}
				onChange={() => {
					if (selectedYear !== currentYear) {
						setSelectedSelectedYear(currentYear)
					} else {
						setSelectedSelectedYear(null)
					}
				}} />

			<CommonFilterOption
				id={customYearName}
				name={customYearName}
				value={customYearOpen}
				selected={true}
				onChange={() => {
					setCustomYearOpen(!customYearOpen);
				}} />

			<AnimatePresence>
				{customYearOpen && (
					<motion.div
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: "auto" }}
						exit={{ opacity: 0, height: 0 }}
						className="overflow-hidden"
					>
						<input
							type="number"
							placeholder="Ingrese otro año"
							className="ml-5 p-2 rounded text-black w-4/5 mt-2"
							min="1900"
							max="2100"
							value={selectedYear}
							onChange={(e) => setSelectedSelectedYear(e.target.value)}
							onKeyDown={handleCustomYearEnter}
						/>
					</motion.div>
				)}
			</AnimatePresence>
			{/* <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="pb-4">
				{[new Date().getFullYear().toString(), "otros"].map((y) => (
					<label key={y} className={labelStyle}>
						<input
							type="radio"
							className={radioStyle}
							name="anio"
							checked={selected.year === y}
							onChange={() => handleChange("year", y)}
						/>
						<span>{y === "otros" ? "Otros" : y}</span>
					</label>
				))}
				<AnimatePresence>
					{selected.year === "otros" && (
						<motion.div
							initial={{ opacity: 0, height: 0 }}
							animate={{ opacity: 1, height: "auto" }}
							exit={{ opacity: 0, height: 0 }}
							className="overflow-hidden"
						>
							<input
								type="number"
								placeholder="Ingrese otro año"
								className="ml-5 p-2 rounded text-black w-4/5 mt-2"
								min="1900"
								max="2100"
								value={customYear}
								onChange={(e) => setCustomYear(e.target.value)}
								onKeyDown={handleCustomYearEnter}
							/>
						</motion.div>
					)}
				</AnimatePresence>
			</motion.div> */}
		</>
	);
}

function PrintedStateFilter({ changePrintedStateValue }) {
	return (
		<div></div>
	);
}