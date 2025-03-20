"use client";

import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp } from "@deemlol/next-icons";
import { useRouter } from "next/navigation";

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
        const token = localStorage.getItem("token"); 
        if (!token) {
          console.error("No hay token en localStorage");
          router.push("/"); // Redirige al login si no hay token
          return;
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/group`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Error al obtener titulaciones");
        }

        const data = await response.json();
        setTitulaciones(data);
      } catch (error) {
        console.error(error);
        router.push("/dashboard"); // Redirige en caso de error
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

  return (
    <div className="w-64 bg-gray-900 text-white p-4 rounded-lg shadow-lg">
      {/* TITULACIÓN */}
      <div className="mb-4">
        <button
          onClick={() => toggleSection("titulacion")}
          className="w-full flex justify-between items-center bg-gray-800 p-3 rounded-md"
        >
          Titulación
          {openSections.titulacion ? <ChevronUp /> : <ChevronDown />}
        </button>

        {openSections.titulacion && (
          <div className="mt-2 space-y-2 pl-3">
            {loading ? (
              <p>Cargando...</p>
            ) : (
              titulaciones.map((group) => (
                <label key={group.id} className="flex items-center space-x-2">
                  <input type="checkbox" className="w-5 h-5 accent-blue-500" />
                  <span className="text-white">{group.name}</span>
                </label>
              ))
            )}
          </div>
        )}
      </div>

      {/* ESTADO */}
      <div className="mb-4">
        <button
          onClick={() => toggleSection("estado")}
          className="w-full flex justify-between items-center bg-gray-800 p-3 rounded-md"
        >
          Estado
          {openSections.estado ? <ChevronUp /> : <ChevronDown />}
        </button>

        {openSections.estado && (
          <div className="mt-2 space-y-2 pl-3">
            {["NO VALIDO", "PARA IMPRIMIR", "IMPRESO"].map((estado) => (
              <label key={estado} className="flex items-center space-x-2">
                <input type="checkbox" className="w-5 h-5 accent-blue-500" />
                <span className="text-white">{estado}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* AÑO ACADÉMICO */}
      <div className="mb-4">
        <button
          onClick={() => toggleSection("anioAcademico")}
          className="w-full flex justify-between items-center bg-gray-800 p-3 rounded-md"
        >
          Año Académico
          {openSections.anioAcademico ? <ChevronUp /> : <ChevronDown />}
        </button>

        {openSections.anioAcademico && (
          <div className="mt-2 space-y-2 pl-3">
            {["2022-2023", "2023-2024", "2024-2025"].map((anio) => (
              <label key={anio} className="flex items-center space-x-2">
                <input type="checkbox" className="w-5 h-5 accent-blue-500" />
                <span className="text-white">{anio}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
