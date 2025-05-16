"use client";

import { useState, useEffect } from "react";
import FilterSidebar from "@/components/filters";
import CarnetTable from "@/components/CarnetTable";
import Header from "@/components/header";
import { useRouter } from "next/navigation";
import { getFilteredMembers, printMembers } from "@/services/member";
import WarningModal from "@/components/modals/WarningModal";
import { AnimatePresence, motion } from "framer-motion";

export default function Page() {
  const [data, setData] = useState([]);
  const [newFilteredData, setNewFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageLoading, setPageLoading] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);
  const [error, setError] = useState(null);
  const router = useRouter();
  const [showWarning, setShowWarning] = useState(false);
  const [selectedCarnets, setSelectedCarnets] = useState([]);
  const [clientMounted, setClientMounted] = useState(false);

  const [filters, setFilters] = useState({
    fullName: "",
    dni: "",
    group: "",
    year: null,
    printed: null,
    validationState: "",
    limit: 30,
  });

  useEffect(() => {
    setClientMounted(true);
    const stored = localStorage.getItem("selectedCarnets");
    if (stored) {
      setSelectedCarnets(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    getFilteredMembers({ limit: filters.limit, offset: 0 })
      .then((res) => {
        setData(res);
        setNewFilteredData([]);
        setLoading(false);
        if (res.length < filters.limit) setHasMoreData(false);
      })
      .catch((error) => {
        console.error(error);
        setError(true);
        router.push("/");
      });
  }, []);

  useEffect(() => {
    if (newFilteredData.length > 0) {
      setData((prev) => [...prev, ...newFilteredData]);
      setNewFilteredData([]);
    }
  }, [newFilteredData]);

  const handleApplyFilters = (newPartialFilters) => {
    setLoading(true);

    const updatedFilters = {
      ...filters,
      ...newPartialFilters,
    };

    setFilters(updatedFilters);

    getFilteredMembers({ ...updatedFilters, offset: 0 })
      .then((res) => {
        setData(res);
        setHasMoreData(res.length >= 30);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  };

  const handlePrintValidOnly = () => {
    const validIds = [];

    selectedCarnets.forEach((carnet) => {
      if (carnet.validationState === "VALIDADO") {
        validIds.push(carnet.id);
      }
    });

    console.log("Carnets válidos para imprimir (solo IDs):", validIds);
    printCarnets(validIds);
    setShowWarning(false);
  };

  const printCarnets = async (ids) => {
    await printMembers(ids);
    alert("Carnets enviados a imprimir. Revisa tu CardPresso");
  };

  const loadMore = () => {
    if (!hasMoreData || pageLoading) return;

    setPageLoading(true);

    const currentOffset = data.length;

    getFilteredMembers({ limit: 30, offset: currentOffset })
      .then((res) => {
        setNewFilteredData(res);
        if (res.length < 30) setHasMoreData(false);
        setPageLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setPageLoading(false);
      });
  };

  return (
    <>
      <AnimatePresence>
        {clientMounted && showWarning && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowWarning(false)}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <WarningModal
                open={showWarning}
                onClose={() => setShowWarning(false)}
                onConfirmValidOnly={handlePrintValidOnly}
                onReview={() => router.push(`/dashboard/carnets/${selectedCarnets[0]?.id}`)}
                selectedCarnets={selectedCarnets}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="h-screen w-full">
        {error ? (
          <div className="flex h-screen items-center justify-center">
            <h1 className="text-3xl font-bold text-red-500">
              Error al cargar los datos.
            </h1>
          </div>
        ) : (
          <>
            <Header
              selectedIds={selectedIds}
              onSearch={handleApplyFilters}
              showWarning={showWarning}
              setShowWarning={setShowWarning}
            />
            <div className="flex pt-16 h-[calc(100vh-4rem)] overflow-hidden">
              <aside className="w-64 h-full shrink-0 mt-8">
                <FilterSidebar onApply={handleApplyFilters} />
              </aside>
              <main className="flex-1 flex flex-col px-0 mt-1">
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
    </>
  );
}