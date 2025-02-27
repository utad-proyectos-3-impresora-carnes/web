"use client";

import { useState, useEffect } from "react";
import FilterSidebar from "../Components/filters";
import Table from "../Components/table";

export default function Page() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});

  useEffect(() => {
//    fetch("https://api-hxge.onrender.com/api/member")
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/member`)
      .then((response) => response.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setLoading(false);
      });
  }, []);

  const handleApplyFilters = (filters) => {
    setFilters(filters);
    // Aquí podrías filtrar `data` según los filtros aplicados
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar de filtros */}
      <FilterSidebar onApply={handleApplyFilters} />

      {/* Contenedor de la tabla */}
      <div className="flex-1 p-6">
        <Table data={data} loading={loading} />
      </div>
    </div>
  );
}



