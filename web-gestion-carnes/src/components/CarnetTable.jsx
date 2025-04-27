'use client';

import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Eye } from '@deemlol/next-icons';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Checkbox, Button, CircularProgress
} from '@mui/material';

import Loading from '@/components/loading';

export default function CarnetTable({ data, loading, selectedIds, setSelectedIds, limit, loadMore, hasMoreData, pageLoading }) {

  {/* TODO: ARREGLAR LA SELECCION DE TODOS LOS CARNETS*/}

  const router = useRouter();
  const observerRef = useRef();

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

  // 🛠 Cuando el observer detecta que se llegó abajo
  useEffect(() => {
    if (!hasMoreData) return; // ❌ No observes si ya no hay más datos

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 1.0 }
    );

    if (observerRef.current) observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [loadMore, hasMoreData]);

  const handleViewCarnet = (id) => {
    router.push(`/dashboard/carnet/${id}`);
  };

  const nodes = data.map((item) => ({
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

  const allVisibleSelected = nodes.length > 0 && selectedVisibleCount === nodes.length;

  const handleSelectAllVisible = () => {
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
          {selectedVisibleCount > 0 && (
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
                    Seleccionar los {data.length} carnets
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
                      backgroundColor: index % 2 === 0 ? '#ffffff' : '#E5E9EC'
                    }}
                  >
                    <TableCell sx={compactCellStyle}>{item.fullName}</TableCell>
                    <TableCell sx={compactCellStyle}>{item.dni}</TableCell>
                    <TableCell sx={compactCellStyle}>{item.titulacion}</TableCell>
                    <TableCell sx={compactCellStyle}>{item.year}</TableCell>
                    <TableCell sx={compactCellStyle}>
                      <span
                        className={`px-2 py-0.5 rounded-sm font-medium ${
                          item.validationState === 'VALIDADO' ? 'bg-[#73c66c]/40 text-[#356f30]' :
                          item.validationState === 'NO VÁLIDO' ? 'bg-[#e66c6c]/40 text-[#852d2d]' :
                          item.validationState === 'POR VALIDAR' ? 'bg-[#ebd758]/40 text-[#8a7b22]' : ''
                        }`}
                      >
                        {item.validationState}
                      </span>
                    </TableCell>
                    <TableCell sx={compactCellStyle}>
                      <span
                        className={`px-2 py-0.5 rounded-sm font-medium ${
                          item.printed ? 'bg-[#73c66c]/40 text-[#356f30]' : 'bg-[#e66c6c]/40 text-[#852d2d]'
                        }`}
                      >
                        {item.printed ? 'Sí' : 'No'}
                      </span>
                    </TableCell>
                    <TableCell sx={compactCellStyle} align="right">
                      <div className="flex items-center justify-end gap-3">
                      <button
                          title="Ver carnet"
                          onClick={() => handleViewCarnet(item.id)}
                          className="flex items-center justify-center w-6 h-6 rounded-full bg-white hover:scale-110 shadow-lg hover:shadow-lg transition-all duration-300"
                        >
                          <Eye className="w-4 h-4 text-blue-600" />
                        </button>

                        <Checkbox                          
                          size="small"
                          sx={{ p: '4px',
                            color: '#3b82f6',
                            '&.Mui-checked': {
                              color: '#3b82f6',
                            }
                           }}
                          checked={selectedIds.includes(item.id)}
                          onChange={() => handleToggleId(item.id)}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}

                {hasMoreData && (
                  <TableRow>
                    <TableCell colSpan={7}>
                      <div
                        ref={observerRef}
                        className="flex justify-center items-center gap-2 py-4 text-sm text-gray-500"
                      >
                        {pageLoading ? (
                          <>
                            <CircularProgress size={20} thickness={5} />
                            <span>Cargando más carnets...</span>
                          </>
                        ) : (
                          <span>Desliza para cargar más</span>
                        )}
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
