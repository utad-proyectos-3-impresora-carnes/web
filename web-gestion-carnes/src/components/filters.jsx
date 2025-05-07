"use client";

import { useState, useEffect } from "react";
import { ChevronDown } from "@deemlol/next-icons";
import { AnimatePresence, motion } from "framer-motion";
import { getGroupMetadata } from "@/services/member";
import { getAllGroups } from "@/services/group";
import { useRouter } from "next/navigation";

export default function FilterSidebar({ onApply }) {
	const [openSections, setOpenSections] = useState({
		titulacion: false,
		estado: false,
		anioAcademico: false,
		impreso: false,
	});

	const [titulaciones, setTitulaciones] = useState([]);
	const [states, setStates] = useState([]);
	const [loading, setLoading] = useState(true);
	const [customYear, setCustomYear] = useState("");

	const [selected, setSelected] = useState({});

	const router = useRouter();

	useEffect(() => {
		getAllGroups()
			.then(setTitulaciones)
			.catch((err) => {
				console.error(err);
				router.push("/");
			});
	}, [router]);

	useEffect(() => {
		getGroupMetadata()
			.then((metadata) => {
				if (metadata?.validationStates) setStates(metadata.validationStates);
			})
			.catch((err) => {
				console.error(err);
				router.push("/");
			})
			.finally(() => setLoading(false));
	}, [router]);

	const sectionWrapperStyle = "bg-[#101426] text-white border border-white rounded-md overflow-hidden";
	const sectionButtonStyle = "w-full flex justify-between items-center px-4 py-4 text-base font-medium";
	const labelStyle = "flex items-center space-x-3 py-2 pl-5 text-[15px] text-white";
	const radioStyle = "w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500";
	const chevronStyle = (open) => `w-5 h-5 transition-transform duration-300 ${open ? "rotate-180" : ""}`;

	const updateFilters = (newSelected) => {
		const filters = {};
		if (newSelected.group) filters.group = [newSelected.group];
		if (newSelected.validationState) filters.validationState = [newSelected.validationState];
		if (newSelected.year) {
			if (newSelected.year === "otros" && customYear) {
				filters.year = [parseInt(customYear)];
			} else if (newSelected.year !== "otros") {
				filters.year = [parseInt(newSelected.year)];
			}
		}
		if (newSelected.printed) {
			filters.printed = newSelected.printed === "Sí";
		}
		onApply(filters);
	};

	const handleChange = (type, value) => {
		const newSelected = { ...selected };

		if (newSelected[type] === value) {
			delete newSelected[type];
		} else {
			newSelected[type] = value;
		}

		setSelected(newSelected);
		updateFilters(newSelected);
	};

	const clearFilters = () => {
		setSelected({});
		setCustomYear("");
		onApply({});
	};

	const handleCustomYearEnter = (e) => {
		if (e.key === "Enter" && selected.year === "otros" && customYear) {
			updateFilters({ ...selected });
		}
	};

	return (
		<div className="w-64 text-white px-0 py-5 fixed top-16 left-0 bottom-0 overflow-y-auto ml-[-4px] mt-[-15px]">
			<div className="flex flex-col">
				{/* TITULACIÓN */}
				<div className={sectionWrapperStyle}>
					<button onClick={() => setOpenSections(p => ({ ...p, titulacion: !p.titulacion }))} className={sectionButtonStyle}>
						Titulación
						<ChevronDown className={chevronStyle(openSections.titulacion)} />
					</button>
					<AnimatePresence initial={false}>
						{openSections.titulacion && (
							<motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="pb-4">
								{loading ? (
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
								)}
							</motion.div>
						)}
					</AnimatePresence>
				</div>

				{/* ESTADO */}
				<div className={sectionWrapperStyle}>
					<button onClick={() => setOpenSections(p => ({ ...p, estado: !p.estado }))} className={sectionButtonStyle}>
						Estado
						<ChevronDown className={chevronStyle(openSections.estado)} />
					</button>
					<AnimatePresence initial={false}>
						{openSections.estado && (
							<motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="pb-4">
								{states.map((s) => (
									<label key={s} className={labelStyle}>
										<input
											type="radio"
											className={radioStyle}
											name="estado"
											checked={selected.validationState === s}
											onChange={() => handleChange("validationState", s)}
										/>
										<span>
											{s === "to_validate" ? "POR VALIDAR" : s === "validated" ? "VALIDADO" : s === "rejected" ? "NO VÁLIDO" : "DESCONOCIDO"}
										</span>
									</label>
								))}
							</motion.div>
						)}
					</AnimatePresence>
				</div>

				{/* AÑO ACADÉMICO */}
				<div className={sectionWrapperStyle}>
					<button onClick={() => setOpenSections(p => ({ ...p, anioAcademico: !p.anioAcademico }))} className={sectionButtonStyle}>
						Año Académico
						<ChevronDown className={chevronStyle(openSections.anioAcademico)} />
					</button>
					<AnimatePresence initial={false}>
						{openSections.anioAcademico && (
							<motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="pb-4">
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
							</motion.div>
						)}
					</AnimatePresence>
				</div>

				{/* IMPRESO */}
				<div className={sectionWrapperStyle}>
					<button onClick={() => setOpenSections(p => ({ ...p, impreso: !p.impreso }))} className={sectionButtonStyle}>
						Impreso
						<ChevronDown className={chevronStyle(openSections.impreso)} />
					</button>
					<AnimatePresence initial={false}>
						{openSections.impreso && (
							<motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="pb-4">
								{["Sí", "No"].map((v) => (
									<label key={v} className={labelStyle}>
										<input
											type="radio"
											className={radioStyle}
											name="impreso"
											checked={selected.printed === v}
											onChange={() => handleChange("printed", v)}
										/>
										<span>{v}</span>
									</label>
								))}
							</motion.div>
						)}
					</AnimatePresence>
				</div>

				{/* CLEAR BUTTON */}
				<div className="px-4 mt-4">
					<button
						className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded"
						onClick={clearFilters}
					>
						Eliminar Filtros
					</button>
				</div>
			</div>
		</div>
	);
}
