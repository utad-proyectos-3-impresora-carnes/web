'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Eye } from '@deemlol/next-icons';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Checkbox, Button, CircularProgress
} from '@mui/material';

import Loading from '@/components/loading';

export default function CarnetTable({ data, loading, selectedIds, setSelectedIds }) {
  const router = useRouter();
  const observerRef = useRef();

  const [itemsToShow, setItemsToShow] = useState(30);
  const [visibleData, setVisibleData] = useState([]);
  const [massSelectMode, setMassSelectMode] = useState(false);

  const compactCellStyle = {
    paddingTop: '4px',
    paddingBottom: '4px',
    paddingLeft: '8px',
    paddingRight: '16px'
  };

  const translateValidation = (state) => {
    switch (state) {
      case 'to_validate':
        return 'POR VALIDAR';
      case 'validated':
        return 'VALIDADO';
      case 'rejected':
        return 'NO VÁLIDO';
      default:
        return 'DESCONOCIDO';
    }
  };

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
    router.push(`/dashboard/carnet/${id}`);
  };

  const nodes = visibleData.map((item) => ({
    id: item._id,
    fullName: item.fullName,
    dni: item.dni,
    titulacion: item.group?.name || '',
    validationState: translateValidation(item.validationState),
    year: item.creationYear || '—',
    printed: item.printed ?? false
  }));

  const selectedVisibleCount = nodes.filter((n) =>
    selectedIds.includes(n.id)
  ).length;

  const allVisibleSelected = visibleData.length > 0 && selectedVisibleCount === visibleData.length;

  const handleSelectAllVisible = () => {
    setMassSelectMode(true);
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
    <div className="h-full rounded-xl border border-gray-300 shadow-md overflow-hidden">
      {loading ? (
        <Loading />
      ) : (
        <>
          {massSelectMode && selectedVisibleCount > 0 && (
            <div className="bg-[#0f172a] text-white px-4 py-3 text-sm border-b border-gray-700">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span>
                  Se han seleccionado <strong>{selectedVisibleCount}</strong> carnets visibles.
                </span>
                {selectedIds.length < data.length && (
                  <Button
                    variant="text"
                    sx={{ color: '#3b82f6', textTransform: 'none' }}
                    onClick={() => {
                      const allIds = data.map((item) => item._id);
                      setSelectedIds((prev) => Array.from(new Set([...prev, ...allIds])));
                    }}
                  >
                    Seleccionar los {data.length} carnets en Para Imprimir
                  </Button>
                )}
              </div>
            </div>
          )}

          <TableContainer
            className="h-full overflow-auto"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
              maxHeight: '100%',
              flexGrow: 1,
              overflowY: 'auto',
            }}
          >
            <Table stickyHeader className="min-w-full" sx={{ flex: '1 1 auto' }}>
              <TableHead>
                <TableRow>
                  {['Nombre', 'DNI', 'Titulación', 'Año', 'Estado', 'Impreso'].map((header) => (
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
                    Visualizar carnet
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
                    <TableCell sx={compactCellStyle}>{item.fullName}</TableCell>
                    <TableCell sx={compactCellStyle}>{item.dni}</TableCell>
                    <TableCell sx={compactCellStyle}>{item.titulacion}</TableCell>
                    <TableCell sx={compactCellStyle}>{item.year}</TableCell>
                    <TableCell sx={compactCellStyle}>
                      <span
                        className={`
                          px-2 py-0.5 rounded-sm font-medium
                          ${item.validationState === 'VALIDADO' ? 'bg-[#73c66c]/40 text-[#356f30]' : ''}
                          ${item.validationState === 'NO VÁLIDO' ? 'bg-[#e66c6c]/40 text-[#852d2d]' : ''}
                          ${item.validationState === 'POR VALIDAR' ? 'bg-[#ebd758]/40 text-[#8a7b22]' : ''}
                        `}
                      >
                        {item.validationState}
                      </span>
                    </TableCell>
                    <TableCell sx={compactCellStyle}>
                      <span
                        className={`
                          px-2 py-0.5 rounded-sm font-medium
                          ${item.printed ? 'bg-[#73c66c]/40 text-[#356f30]' : 'bg-[#e66c6c]/40 text-[#852d2d]'}
                        `}
                      >
                        {item.printed ? 'Sí' : 'No'}
                      </span>
                    </TableCell>
                    <TableCell sx={compactCellStyle} align="right">
                      <div className="flex items-center justify-end gap-3">
                        <button title="Ver carnet" onClick={() => handleViewCarnet(item.id)}>
                          <Eye className="w-5 h-5 text-gray-600 cursor-pointer" />
                        </button>
                        <Checkbox
                          size="small"
                          sx={{ p: '4px' }}
                          checked={selectedIds.includes(item.id)}
                          onChange={() => handleToggleId(item.id)}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {itemsToShow < data.length && (
                  <TableRow>
                    <TableCell colSpan={7}>
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
