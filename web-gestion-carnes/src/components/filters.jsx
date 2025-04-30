"use client";

import { useState, useEffect } from "react";
import { ChevronDown } from "@deemlol/next-icons";
import { AnimatePresence, motion } from "framer-motion";
import { getAllGroups, getGroupMetadata } from "@/services/member";
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
  const router = useRouter();

  const [selectedTitulaciones, setSelectedTitulaciones] = useState([]);
  const [selectedEstados, setSelectedEstados] = useState([]);
  const [selectedYears, setSelectedYears] = useState([]);
  const [selectedImpreso, setSelectedImpreso] = useState([]);
  const [customYear, setCustomYear] = useState("");
  const [showApplyButton, setShowApplyButton] = useState(false);

  const [appliedFilters, setAppliedFilters] = useState({
	selectedTitulaciones: [],
	selectedEstados: [],
	selectedYears: [],
	selectedImpreso: [],
	customYear: ""
  });
  


  useEffect(() => {
    async function fetchData() {
      try {
        const groups = await getAllGroups();
        setTitulaciones(groups);
      } catch (err) {
        console.error(err);
        router.push("/");
      }
    }
    fetchData();
  }, [router]);

  useEffect(() => {
    async function fetchStates() {
      try {
        const metadata = await getGroupMetadata();
        if (metadata?.validationStates) {
          setStates(metadata.validationStates);
        }
      } catch (err) {
        console.error(err);
        router.push("/");
      } finally {
        setLoading(false);
      }
    }
    fetchStates();
  }, [router]);

  const toggleSection = (section) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleCheckbox = (array, setArray, value) => {
    if (array.includes(value)) {
      setArray(array.filter((v) => v !== value));
    } else {
      setArray([...array, value]);
    }

	if (value === "otros" && setArray === setSelectedYears) {
		setCustomYear(""); 
	  }
	  
  };

  const applyFilters = () => {
	const filters = {};
  
	if (selectedTitulaciones.length > 0) filters.group = selectedTitulaciones;
	if (selectedEstados.length > 0) filters.validationState = selectedEstados;
  
	const years = [];
  
	if (selectedYears.includes(new Date().getFullYear().toString())) {
	  years.push(new Date().getFullYear());
	}
	if (selectedYears.includes("otros") && customYear) {
	  years.push(parseInt(customYear));
	}
  
	if (years.length > 0) {

	  filters.year = years;
	}
  
	if (selectedImpreso.length > 0) {
	  if (selectedImpreso.includes("Sí") && !selectedImpreso.includes("No")) {
		filters.printed = true;
	  } else if (selectedImpreso.includes("No") && !selectedImpreso.includes("Sí")) {
		filters.printed = false;
	  }
	}

	setAppliedFilters({
		selectedTitulaciones,
		selectedEstados,
		selectedYears,
		selectedImpreso,
		customYear
	  });
	  onApply(filters);
	  
  };
  
  useEffect(() => {
	const isModified =
	  selectedTitulaciones.length > 0 ||
	  selectedEstados.length > 0 ||
	  selectedImpreso.length > 0 ||
	  (selectedYears.length > 0 || customYear.trim() !== "");
	  
	setShowApplyButton(isModified);
  }, [selectedTitulaciones, selectedEstados, selectedYears, selectedImpreso, customYear]);

  useEffect(() => {
	const isDifferent =
	  JSON.stringify(selectedTitulaciones) !== JSON.stringify(appliedFilters.selectedTitulaciones) ||
	  JSON.stringify(selectedEstados) !== JSON.stringify(appliedFilters.selectedEstados) ||
	  JSON.stringify(selectedYears) !== JSON.stringify(appliedFilters.selectedYears) ||
	  JSON.stringify(selectedImpreso) !== JSON.stringify(appliedFilters.selectedImpreso) ||
	  customYear !== appliedFilters.customYear;
  
	setShowApplyButton(isDifferent);
  }, [selectedTitulaciones, selectedEstados, selectedYears, selectedImpreso, customYear, appliedFilters]);
  
  
  

  const sectionWrapperStyle = "bg-[#101426] text-white border border-white rounded-md overflow-hidden";
  const sectionButtonStyle = "w-full flex justify-between items-center px-4 py-4 text-base font-medium";
  const labelStyle = "flex items-center space-x-3 py-2 pl-5 text-[15px] text-white";
  const checkboxStyle = "w-5 h-5 accent-blue-500";
  const chevronStyle = (open) => `w-5 h-5 transition-transform duration-300 ${open ? "rotate-180" : ""}`;


  

  return (
    <div className="w-64 text-white px-0 py-5 fixed top-16 left-0 bottom-0 overflow-y-auto ml-[-4px] mt-[-15px]">
      <div className="flex flex-col">

        {/* TITULACIÓN */}
        <div className={sectionWrapperStyle}>
          <button onClick={() => toggleSection("titulacion")} className={sectionButtonStyle}>
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
                        type="checkbox"
                        className={checkboxStyle}
                        checked={selectedTitulaciones.includes(t.name)}
                        onChange={() => handleCheckbox(selectedTitulaciones, setSelectedTitulaciones, t.name)}
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
          <button onClick={() => toggleSection("estado")} className={sectionButtonStyle}>
            Estado
            <ChevronDown className={chevronStyle(openSections.estado)} />
          </button>
          <AnimatePresence initial={false}>
            {openSections.estado && (
              <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="pb-4">
                {states.map((s) => (
                  <label key={s} className={labelStyle}>
                    <input
                      type="checkbox"
                      className={checkboxStyle}
                      checked={selectedEstados.includes(s)}
                      onChange={() => handleCheckbox(selectedEstados, setSelectedEstados, s)}
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
          <button onClick={() => toggleSection("anioAcademico")} className={sectionButtonStyle}>
            Año Académico
            <ChevronDown className={chevronStyle(openSections.anioAcademico)} />
          </button>
          <AnimatePresence initial={false}>
            {openSections.anioAcademico && (
              <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="pb-4">
                <label className={labelStyle}>
                  <input
                    type="checkbox"
                    className={checkboxStyle}
                    checked={selectedYears.includes(new Date().getFullYear().toString())}
                    onChange={() => handleCheckbox(selectedYears, setSelectedYears, new Date().getFullYear().toString())}
                  />
                  <span>{new Date().getFullYear()}</span>
                </label>

                <label className={labelStyle}>
                  <input
                    type="checkbox"
                    className={checkboxStyle}
                    checked={selectedYears.includes("otros")}
                    onChange={() => handleCheckbox(selectedYears, setSelectedYears, "otros")}
                  />
                  <span>Otros</span>
                </label>

                {selectedYears.includes("otros") && (
                  <input
                    type="number"
                    placeholder="Ingrese otro año"
                    className="ml-5 p-2 rounded text-black w-4/5 mt-2"
                    min="1900"
                    max="2100"
                    value={customYear}
                    onChange={(e) => setCustomYear(e.target.value)}
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* IMPRESO */}
        <div className={sectionWrapperStyle}>
          <button onClick={() => toggleSection("impreso")} className={sectionButtonStyle}>
            Impreso
            <ChevronDown className={chevronStyle(openSections.impreso)} />
          </button>
          <AnimatePresence initial={false}>
            {openSections.impreso && (
              <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="pb-4">
                {["Sí", "No"].map((valor) => (
                  <label key={valor} className={labelStyle}>
                    <input
                      type="checkbox"
                      className={checkboxStyle}
                      checked={selectedImpreso.includes(valor)}
                      onChange={() => handleCheckbox(selectedImpreso, setSelectedImpreso, valor)}
                    />
                    <span>{valor}</span>
                  </label>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* BOTÓN APLICAR FILTROS */}
		{
		 showApplyButton && (
			<div className="px-4 mt-4">
			<button onClick={applyFilters} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded">
				Aplicar Filtros
			</button>
			</div>
		)}
      </div>
    </div>
  );
}
  