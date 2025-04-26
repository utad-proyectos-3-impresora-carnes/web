"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "@deemlol/next-icons";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { getAllGroups } from "@/services/group";

export default function FilterSidebar() {
	const [openSections, setOpenSections] = useState({
		titulacion: false,
		estado: false,
		anioAcademico: false,
	});

	const [titulaciones, setTitulaciones] = useState([]);
	const [loading, setLoading] = useState(true);
	const router = useRouter();

	useEffect(() => {
		const fetchTitulaciones = async () => {
			try {

				setTitulaciones(await getAllGroups());
			} catch (error) {
				console.error(error);
				router.push("/dashboard");
			} finally {
				setLoading(false);
			}
		};

		fetchTitulaciones();
	}, [router]);

	const toggleSection = (section) => {
		setOpenSections((prev) => ({
			...prev,
			[section]: !prev[section],
		}));
	};

	const dropdownAnimation = {
		initial: { opacity: 0, height: 0 },
		animate: { opacity: 1, height: "auto" },
		exit: { opacity: 0, height: 0 },
		transition: { duration: 0.3, ease: "easeInOut" },
	};

	const sectionWrapperStyle =
		"bg-[#101426] text-white border border-white rounded-md overflow-hidden";

	const sectionButtonStyle =
		"w-full flex justify-between items-center px-4 py-4 text-base font-medium";

	const chevronStyle = (open) =>
		`w-5 h-5 transition-transform duration-300 ${open ? "rotate-180" : ""}`;

	const labelStyle = "flex items-center space-x-3 py-2 pl-5 text-[15px] text-white";

	const checkboxStyle = "w-5 h-5 accent-blue-500";

	return (
		<div className="w-64 text-white px-0 py-5 fixed top-16 left-0 bottom-0 overflow-y-auto ml-[-4px] mt-[-15px]">
			<div className="flex flex-col">
				{/* TITULACIÓN */}
				<div className={sectionWrapperStyle}>
					<button
						onClick={() => toggleSection("titulacion")}
						className={sectionButtonStyle}
					>
						Titulación
						<ChevronDown className={chevronStyle(openSections.titulacion)} />
					</button>

					<AnimatePresence initial={false}>
						{openSections.titulacion && (
							<motion.div {...dropdownAnimation} className="pb-4">
								{loading ? (
									<p className="text-gray-400 pl-5 text-sm">Cargando...</p>
								) : (
									titulaciones.map((group) => (
										<label
											key={group.id || group._id || group.name}
											className={labelStyle}
										>
											<input type="checkbox" className={checkboxStyle} />
											<span>{group.name}</span>
										</label>
									))
								)}
							</motion.div>
						)}
					</AnimatePresence>
				</div>

				{/* ESTADO */}
				<div className={sectionWrapperStyle}>
					<button
						onClick={() => toggleSection("estado")}
						className={sectionButtonStyle}
					>
						Estado
						<ChevronDown className={chevronStyle(openSections.estado)} />
					</button>

					<AnimatePresence initial={false}>
						{openSections.estado && (
							<motion.div {...dropdownAnimation} className="pb-4">
								{["NO VALIDO", "PARA IMPRIMIR", "IMPRESO"].map((estado) => (
									<label key={estado} className={labelStyle}>
										<input type="checkbox" className={checkboxStyle} />
										<span>{estado}</span>
									</label>
								))}
							</motion.div>
						)}
					</AnimatePresence>
				</div>

				{/* AÑO ACADÉMICO */}
				<div className={sectionWrapperStyle}>
					<button
						onClick={() => toggleSection("anioAcademico")}
						className={sectionButtonStyle}
					>
						Año Académico
						<ChevronDown className={chevronStyle(openSections.anioAcademico)} />
					</button>

					<AnimatePresence initial={false}>
						{openSections.anioAcademico && (
							<motion.div {...dropdownAnimation} className="pb-4">
								{["2022-2023", "2023-2024", "2024-2025"].map((anio) => (
									<label key={anio} className={labelStyle}>
										<input type="checkbox" className={checkboxStyle} />
										<span>{anio}</span>
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
