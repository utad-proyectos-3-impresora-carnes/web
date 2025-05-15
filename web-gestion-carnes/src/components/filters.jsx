"use client";

import { useState, useEffect } from "react";
import { ChevronDown } from "@deemlol/next-icons";
import { AnimatePresence, motion } from "framer-motion";
import { getMemberMetadata } from "@/services/member";
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


	const CloseIcon = () => (
  		<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
    	<path
      		d="M3.92253 2.74414L2.74414 3.92253L8.82162 10L2.74414 16.0775L3.92253 17.2559L10 11.1784L16.0775 17.2559L17.2559 16.0775L11.1784 10L17.2559 3.92253L16.0775 2.74414L10 8.82162L3.92253 2.74414Z"
      		fill="#F05135"
    	/>
  		</svg>
	);


	useEffect(() => {
		getAllGroups()
			.then(setTitulaciones)
			.catch((err) => {
				console.error(err);
				router.push("/");
			});
	}, [router]);

	useEffect(() => {
		getMemberMetadata()
			.then((metadata) => {
				if (metadata?.validationStates) setStates(metadata.validationStates);
			})
			.catch((err) => {
				console.error(err);
				router.push("/");
			})
			.finally(() => setLoading(false));
	}, [router]);

	const sectionWrapperStyle = "bg-white text-[#101426] border border-white rounded-md overflow-hidden font-[Montserrat] font-bold";
	const sectionButtonStyle = "w-full flex justify-between items-center px-4 py-4 text-base font-medium bg-[#101426] text-white font-[Montserrat] font-bold border-t-4 border-black border-r-4 rounded-tr-md";
	const labelStyle = "flex items-center space-x-3 py-2 pl-5 text-[16px] leading-[20px] font-normal text-[#14192C] font-[Montserrat]";
	const radioStyle = "w-4 h-4 accent-blue-600";
	const clearSelectionStyle = "flex items-center justify-start gap-[10px] px-4 py-2 text-[#F05135] font-medium font-montserrat text-[16px] leading-[20px]";
	const chevronStyle = (open) => `w-5 h-5 transition-transform duration-300 ${open ? "rotate-180" : ""}`;

	const updateFilters = (newSelected) => {
	const filters = {};
	if (newSelected.group) filters.group = [newSelected.group];
	if (newSelected.validationState) filters.validationState = [newSelected.validationState];
	if (newSelected.year) {
		if (newSelected.year === 'otros' && customYear) {
		filters.year = [parseInt(customYear)];
		} else if (newSelected.year !== 'otros') {
		filters.year = [parseInt(newSelected.year)];
		}
	}
	if (newSelected.printed) {
		filters.printed = newSelected.printed === "Sí";
	}

	onApply(filters); // solo actualiza esos campos
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
		<div className="w-64 text-white px-0 py-5 fixed top-16 left-0 bottom-0 overflow-y-auto ml-[-4px] mt-[-15px] font-bold">
			<div className="flex flex-col">
				{/* TITULACIÓN */}
				<div className={sectionWrapperStyle}>
					{Object.keys(selected).length > 0 && (
					<div className={clearSelectionStyle} onClick={clearFilters}>
						<CloseIcon />
						<span className="font-bold">Borrar filtros</span>
					</div>
				)}

					<button className={sectionButtonStyle} onClick={() => setOpenSections(p => ({ ...p, titulacion: !p.titulacion }))}>
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
											<span className="font-bold">{t.name}</span>
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
							<motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="pb-4 boder">
								{states.map((s) => (
									<label key={s} className={labelStyle}>
										<input
											type="radio"
											className={radioStyle}
											name="estado"
											checked={selected.validationState === s}
											onChange={() => handleChange("validationState", s)}
										/>
										<span className="font-bold">
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
										<span className="font-bold">{y === "otros" ? "Otros" : y}</span>
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
												className="ml-5 p-2 rounded text-black w-4/5 mt-2 border border-gray-900"
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
										<span className="font-bold">{v}</span>
									</label>
								))}
							</motion.div>
						)}
					</AnimatePresence>
				</div>
			</div>
		</div>
	);
}
