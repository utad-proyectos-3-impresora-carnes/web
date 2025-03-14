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
    const fetchMembersData = async () => {
      const token = localStorage.getItem('token'); // Obtiene el token almacenado
  
      if (!token) {
        console.error("Error: No token found. Redirecting to login...");
        setError(true);
        setMessage('Error: No token found. Please login first.');
        setLoading(false);
        router.push('/'); // Redirige al login
        return;
      }
  
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/member`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (response.status === 401) {
          throw new Error("Token expirado. Redirigiendo al login...");
        }
  
        if (!response.ok) {
          throw new Error(`Error ${response.status}: No se pudieron cargar los miembros`);
        }
  
        const data = await response.json();
        setData(data);
      } catch (error) {
        console.error("Error:", error);
        setError(true);
        setMessage(error.message || "Error al cargar los miembros");
  
        if (error.message.includes("Token expirado")) {
          localStorage.removeItem('token'); // Elimina el token caducado
          router.push('/'); // Redirige al login
        }
      } finally {
        setLoading(false);
      }
    };
  
    fetchMembersData();
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



