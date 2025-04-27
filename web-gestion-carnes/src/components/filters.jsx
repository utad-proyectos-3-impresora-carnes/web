"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "@deemlol/next-icons";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { getAllGroups, getGroupMetadata } from "@/services/member";

export default function FilterSidebar() {
	const [openSections, setOpenSections] = useState({
		titulacion: false,
		estado: false,
		anioAcademico: false,
		impreso: false,
	}, []);

	const [titulaciones, setTitulaciones] = useState([]);
	const [state, setState] = useState([]);
	const [loading, setLoading] = useState(true);
	const router = useRouter();
	const [selectedYears, setSelectedYears] = useState([]);
	const [customYear, setCustomYear] = useState("");

	const handleYearCheckbox = (year) => {
	setSelectedYears((prevSelected) => {
		if (prevSelected.includes(year)) {
		return prevSelected.filter((item) => item !== year);
		} else {
		return [...prevSelected, year];
		}
	});
	};


	useEffect(() => {
		const fetchTitulaciones = async () => {
			try{
				const response = await getAllGroups();
				if (response) {
					setTitulaciones(response);
				} 
			}
			catch (error) {
				console.error("Error fetching titulaciones:", error);
				router.push("/");
			} finally {
				setLoading(false);
			}

		};

		fetchTitulaciones();
	}, [router]);

	useEffect(() => {

		const translateValidation = (state) => {
			switch (state) {
				case "to_validate":
					return "POR VALIDAR";
				case "validated":
					return "VALIDADO";
				case "rejected":
					return "NO VÁLIDO";
				default:
					return "DESCONOCIDO";
			}
			};

			const fetchMetadata = async () => {
				try {
				  const metadata = await getGroupMetadata();
				  if (metadata && metadata.validationStates) {
					const translatedStates = metadata.validationStates.map((item) => ({
					  id: item,  
					  name: translateValidation(item),
					}));
					setState(translatedStates);
				  }
				} catch (error) {
				  console.error("Error fetching metadata:", error);
				  router.push("/");
				} finally {
				  setLoading(false);
				}
			  };
			
			  fetchMetadata(); 
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
								{state.map((estado) => (
									<label key={estado.id} className={labelStyle}>
										<input type="checkbox" className={checkboxStyle} />
										<span>{estado.name}</span>
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
      <motion.div {...dropdownAnimation} className="pb-4 space-y-2">
        <label className={labelStyle}>
          <input
            type="checkbox"
            className={checkboxStyle}
            checked={selectedYears.includes(new Date().getFullYear().toString())}
            onChange={() => handleYearCheckbox(new Date().getFullYear().toString())}
          />
          <span>{new Date().getFullYear()}</span>
        </label>

        <label className={labelStyle}>
          <input
            type="checkbox"
            className={checkboxStyle}
            checked={selectedYears.includes("otros")}
            onChange={() => handleYearCheckbox("otros")}
          />
          <span>Otros</span>
        </label>

					{/* Animación suave del input */}
					<AnimatePresence>
					{selectedYears.includes("otros") && (
						<motion.div
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: "auto" }}
						exit={{ opacity: 0, height: 0 }}
						transition={{ duration: 0.3, ease: "easeInOut" }}
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
					<button
						onClick={() => toggleSection("impreso")}
						className={sectionButtonStyle}
					>
						Impreso
						<ChevronDown className={chevronStyle(openSections.impreso)} />
					</button>

					<AnimatePresence initial={false}>
						{openSections.impreso && (
							<motion.div {...dropdownAnimation} className="pb-4">
								{["Sí", "No"].map((valor) => (
									<label key={valor} className={labelStyle}>
										<input type="checkbox" className={checkboxStyle} />
										<span>{valor}</span>
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
