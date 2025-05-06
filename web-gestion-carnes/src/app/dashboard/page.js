'use client';

import { useState, useEffect } from "react";
import FilterSidebar from "@/components/filters";
import CarnetTable from "@/components/CarnetTable";
import Header from "@/components/header";
import { useRouter } from "next/navigation";
import { getFilteredMembers } from "@/services/member";

export default function Page() {
  const [data, setData] = useState([]);
  const [newFilteredData, setNewFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageLoading, setPageLoading] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);
  const [error, setError] = useState(null);
  const router = useRouter();

  const [filters, setFilters] = useState({
    fullName: "",
    dni: "",
    group: "",
    year: null,
    printed: null,
    validationState: "",
    limit: 30,
  });

  // Primer carga inicial
  useEffect(() => {
    if (typeof window === "undefined") return;

    getFilteredMembers({ limit: filters.limit, offset: 0 }).then(res => {
      setData(res);
      setNewFilteredData([]);
      setLoading(false);
      if (res.length < filters.limit) setHasMoreData(false);
    }).catch(error => {
      console.error(error);
      setError(true);
      router.push("/");
    });
  }, []);

  // Cada vez que llegan nuevos carnets, agregarlos a data
  useEffect(() => {
    if (newFilteredData.length > 0) {
      setData(prev => [...prev, ...newFilteredData]);
      setNewFilteredData([]); // Limpiar después de agregar
    }
  }, [newFilteredData]);

  // Aplicar filtros nuevos
  const handleApplyFilters = (newFilters) => {
    setLoading(true);
    setFilters({
      ...newFilters,
      limit: 30,
    });
    getFilteredMembers({ ...newFilters, limit: 30, offset: 0 }).then(res => {
      setData(res);
      setHasMoreData(res.length >= 30);
      setLoading(false);
    }).catch(error => {
      console.error(error);
      setLoading(false);
    });
  };

  // Cargar más carnets
  const loadMore = () => {
    if (!hasMoreData || pageLoading) return;

    setPageLoading(true);

    const currentOffset = data.length;

    getFilteredMembers({ limit: 30, offset: currentOffset }).then(res => {
      setNewFilteredData(res);
      if (res.length < 30) {
        setHasMoreData(false);
      }
      setPageLoading(false);
    }).catch(error => {
      console.error(error);
      setPageLoading(false);
    });
  };

  return (
    <div className="h-screen w-full overflow-hidden">
      {error ? (
        <div className="flex h-screen items-center justify-center">
          <h1 className="text-3xl font-bold text-red-500">
            Error al cargar los datos.
          </h1>
        </div>
      ) : (
        <>
          <Header selectedIds={selectedIds} onSearch={handleApplyFilters} />
          <div className="flex pt-16 h-[calc(100vh-4rem)] overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 h-full shrink-0 mt-8">
              <FilterSidebar onApply={handleApplyFilters} />
            </aside>

            {/* Contenido principal */}
            <main className="flex-1 overflow-y-auto px-0 mt-1">
              <CarnetTable
                data={data}
                loading={loading}
                selectedIds={selectedIds}
                setSelectedIds={setSelectedIds}
                limit={filters.limit}
                loadMore={loadMore}
                hasMoreData={hasMoreData}
                pageLoading={pageLoading}
                filters={filters}
              />
            </main>
          </div>
        </>
      )}
    </div>
  );
}
