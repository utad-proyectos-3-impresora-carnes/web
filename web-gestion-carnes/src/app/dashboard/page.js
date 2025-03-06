"use client";

import { useState, useEffect } from "react";
import FilterSidebar from "@/components/filters";
import Table from "@/components/table";

export default function Page() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});
  const[error, setError] = useState(null);

  useEffect(() => {
//    fetch("https://api-hxge.onrender.com/api/member")
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/member`)
      .then((response) => 
      {
        if (!response.ok) {
          throw new Error("Error ${response.status}: No se pudieron cargar los miembros");
        }
        return response.json();
      })
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setLoading(false);
        setError(true);
      });
  }, []);

  const handleApplyFilters = (filters) => {
    setFilters(filters);
    // Aquí podrías filtrar `data` según los filtros aplicados
  };


  if (error) {
    return(
      <div className="flex h-screen">
        <div className="flex-1 p-6">
          <h1 className="text-3xl font-bold text-red-500">Error al cargar los datos. F</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
    { error ? (

      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold text-red-500">Error al cargar los datos. F</h1>
      </div>

    ) : (
      <>
        {/* Sidebar de filtros */}
        <FilterSidebar onApply={handleApplyFilters} />

        {/* Contenedor de la tabla */}
        <div className="flex-1 p-6">
          <Table data={data} loading={loading} />
        </div>
      </>
    )}
    </div>
  );
}



