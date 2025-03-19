"use client";

import { useState, useEffect } from "react";
import FilterSidebar from "@/components/filters";
import Table from "@/components/table";
import Header from "@/components/header";
import { useRouter } from "next/navigation";

export default function Page() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});
  const[error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return; // Evita ejecución en el servidor
  
    const fetchMembersData = async () => {
      const token = localStorage.getItem("token");
  
      if (!token) {
        console.error("Error: No token found. Redirecting to login...");
        setError(true);
        setLoading(false);
        router.push("/");
        return;
      }
  
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/member`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (!response.ok) {
          throw new Error(`Error ${response.status}: No se pudieron cargar los miembros`);
        }
  
        const data = await response.json();
        setData(data);
      } catch (error) {
        console.error("Error:", error);
        setError(true);
  
        if (error.message.includes("Token expirado")) {
          localStorage.removeItem("token");
          router.push("/");
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



  return (
    <div className="h-screen w-full">
      {error ? (
        <div className="flex h-screen items-center justify-center">
          <h1 className="text-3xl font-bold text-red-500">
            Error al cargar los datos.
          </h1>
        </div>
      ) : (
        <>
          {/* Header fijo en la parte superior */}
          <Header />
  
          {/* Contenedor principal con Sidebar a la izquierda y Tabla a la derecha */}
          <div className="flex pt-1 h-full">
            {/* Sidebar de filtros a la izquierda */}
            <aside className="w-1/4 bg-gray-100 p-4 h-full">
              <FilterSidebar onApply={handleApplyFilters} />
            </aside>
  
            {/* Contenedor de la tabla */}
            <main className="flex-1 p-6">
              <Table data={data} loading={loading} />
            </main>
          </div>
        </>
      )}
    </div>
  );
  
}



