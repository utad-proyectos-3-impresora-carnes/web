'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Eye } from '@deemlol/next-icons';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Checkbox, Button, CircularProgress
} from '@mui/material';

import Loading from '@/components/loading';

export default function CarnetTable({ data, loading }) {
  const router = useRouter();
  const observerRef = useRef();

  const [itemsToShow, setItemsToShow] = useState(30);
  const [visibleData, setVisibleData] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [massSelectMode, setMassSelectMode] = useState(false);


  useEffect(() => {
    setVisibleData(data.slice(0, itemsToShow));
  }, [data, itemsToShow]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && itemsToShow < data.length) {
          setTimeout(() => setItemsToShow((prev) => prev + 30), 500);
        }
      },
      { threshold: 1.0 }
    );
    if (observerRef.current) observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [itemsToShow, data.length]);

  const handleViewCarnet = (id) => {
    console.log("🔍 Navegando al carnet con ID:", id); // nuevo log
    router.push(`/dashboard/carnet/${id}`);
  };  


  const nodes = visibleData.map((item) => ({
    id: item._id,
    fullName: item.fullName,
    dni: item.dni,
    ageGroup: item.group?.name || '',
  }));

  const selectedVisibleCount = nodes.filter((n) =>
    selectedIds.includes(n.id)
  ).length;

  const allVisibleSelected =
    nodes.length > 0 && selectedVisibleCount === nodes.length;

  const handleSelectAllVisible = () => {
    setMassSelectMode(true); // activar modo masivo
    
    const visibleIds = nodes.map((item) => item.id);
    const allSelected = visibleIds.every((id) => selectedIds.includes(id));
    if (allSelected) {
      setSelectedIds((prev) => prev.filter((id) => !visibleIds.includes(id)));
    } else {
      const newSelections = visibleIds.filter((id) => !selectedIds.includes(id));
      setSelectedIds((prev) => [...prev, ...newSelections]);
    }
  };
    

  const handleToggleId = (id) => {
    setMassSelectMode(false); 
  
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };
  

  return (
    <div className="rounded-xl border border-gray-300 shadow-md overflow-hidden">
      {loading ? (
        <Loading />
      ) : (
        <>
          {massSelectMode && selectedVisibleCount > 0 && (
            <div className="bg-[#0f172a] text-white px-4 py-3 text-sm border-b border-gray-700">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span>
                  Se han seleccionado{' '}
                  <strong>{selectedVisibleCount}</strong> carnets visibles.
                </span>
                {selectedIds.length < data.length && (
                  <Button
                    variant="text"
                    sx={{ color: '#3b82f6', textTransform: 'none' }}
                    onClick={() => setSelectedIds(data.map((item) => item._id))}
                  >
                    Seleccionar los {data.length} carnets en Para Imprimir
                  </Button>
                )}
              </div>
            </div>
          )}

          <TableContainer sx={{ maxHeight: 'calc(100vh - 200px)' }}>
            <Table stickyHeader className="min-w-full">
              <TableHead>
                <TableRow>
                  {['Nombre', 'DNI', 'Edad'].map((header) => (
                    <TableCell
                      key={header}
                      sx={{
                        backgroundColor: '#0f172a',
                        color: 'white',
                        fontWeight: 'bold',
                        position: 'sticky',
                        top: 0,
                        zIndex: 1,
                      }}
                    >
                      {header}
                    </TableCell>
                  ))}
                  <TableCell
                    align="right"
                    sx={{
                      backgroundColor: '#0f172a',
                      color: 'white',
                      fontWeight: 'bold',
                      position: 'sticky',
                      top: 0,
                      zIndex: 1,
                    }}
                  >
                    <div className="flex justify-end items-center gap-3">
                      <Eye className="w-5 h-5 text-white" />
                      <Checkbox
                        checked={allVisibleSelected}
                        onChange={handleSelectAllVisible}
                        sx={{ color: 'white' }}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {nodes.map((item, index) => (
                  <TableRow
                    key={item.id}
                    sx={{
                      backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9fafb'
                    }}
                  >
                    <TableCell>{item.fullName}</TableCell>
                    <TableCell>{item.dni}</TableCell>
                    <TableCell>{item.ageGroup}</TableCell>
                    <TableCell align="right">
                      <div className="flex items-center justify-end gap-3">
                        <button onClick={() => handleViewCarnet(item.id)}>
                          <Eye className="w-5 h-5 text-gray-600 cursor-pointer" />
                        </button>
                        <Checkbox
                          checked={selectedIds.includes(item.id)}
                          onChange={() => handleToggleId(item.id)}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}

                {itemsToShow < data.length && (
                  <TableRow>
                    <TableCell colSpan={4}>
                      <div
                        ref={observerRef}
                        className="flex justify-center items-center gap-2 py-4 text-sm text-gray-500"
                      >
                        <CircularProgress size={20} thickness={5} />
                        Cargando más carnets...
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </div>
  );
}
