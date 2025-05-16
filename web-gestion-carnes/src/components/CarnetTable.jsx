"use client";

// Imports
import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye } from '@deemlol/next-icons';
import {
	Table, TableBody, TableCell, TableContainer,
	TableHead, TableRow, Checkbox, Button, CircularProgress
} from '@mui/material';
import Loading from '@/components/Loading';
import { getFilteredMembers } from '@/services/member';
import AlertIcon from '@/components/icons/AlertIcon';

export default function CarnetTable({ data, loading, selectedIds, setSelectedIds, limit, loadMore, hasMoreData, pageLoading, filters }) {
	const router = useRouter();
	const observerRef = useRef();

	const [allFilteredIds, setAllFilteredIds] = useState([]);
	const [selectingAllFiltered, setSelectingAllFiltered] = useState(false);

  const compactCellStyle = {
    fontWeight: 'bold',
    fontSize: '1rem', // 14px ~ text-sm
    padding: '6px 8px',
    allign: 'left',
  };

    const headerStyle = {	
    backgroundColor: '#0f172a',
		color: 'white',
		fontWeight: 'bold',
		position: 'sticky',
		top: 0,
		zIndex: 1,
		padding: '8px 8px',
		fontSize: '1rem',
		transition: 'all 0.3s ease-in-out',

  }


	const translateValidation = (state) => {
		switch (state) {
			case 'to_validate': return 'POR VALIDAR';
			case 'validated': return 'VALIDADO';
			case 'rejected': return 'NO VÁLIDO';
			default: return 'DESCONOCIDO';
		}
	};

	useEffect(() => {
		if (!hasMoreData) return;
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting) loadMore();
			},
			{ threshold: 1.0 }
		);
		if (observerRef.current) observer.observe(observerRef.current);
		return () => observer.disconnect();
	}, [loadMore, hasMoreData]);

	useEffect(() => {
		localStorage.setItem('selectedCarnetIds', JSON.stringify(selectedIds));
	}, [selectedIds]);

	const nodes = data.map((item) => ({
		id: item._id,
		fullName: item.fullName,
		dni: item.dni,
		titulacion: item.group?.name || '',
		validationState: translateValidation(item.validationState),
		year: item.creationYear || '—',
		printed: item.printed ?? false
	}));

	const visibleIds = nodes.map(n => n.id);
	const allVisibleSelected = visibleIds.length > 0 && visibleIds.every(id => selectedIds.includes(id));

  const handleToggleId = (id) => {
    const item = nodes.find(n => n.id === id);
    if (!item) return;

    const updatedIds = selectedIds.includes(id)
      ? selectedIds.filter(x => x !== id)
      : [...selectedIds, id];

    setSelectedIds(updatedIds);

    // Actualizar localStorage con objetos completos
    const stored = JSON.parse(localStorage.getItem("selectedCarnets")) || [];
    let updatedStored;

    if (selectedIds.includes(id)) {
      // Deseleccionar: remover el objeto
      updatedStored = stored.filter(obj => obj.id !== id);
    } else {
      // Seleccionar: agregar el objeto
      updatedStored = [...stored, item];
    }

    localStorage.setItem("selectedCarnets", JSON.stringify(updatedStored));
  };


	const handleToggleSelectAllVisible = () => {
		if (allVisibleSelected) {
			if (allFilteredIds.length > 0) {
				setSelectedIds([]);
				setAllFilteredIds([]);
				localStorage.removeItem('selectedCarnetIds');
        localStorage.removeItem('selectedCarnets');
			} else {
				setSelectedIds(prev => prev.filter(id => !visibleIds.includes(id)));
			}
		} else {
			const newSelections = visibleIds.filter(id => !selectedIds.includes(id));
			setSelectedIds(prev => [...prev, ...newSelections]);
		}
	};

	const handleSelectAllFiltered = async () => {
		if (selectingAllFiltered) return;
		try {
			setSelectingAllFiltered(true);
			const result = await getFilteredMembers({ ...filters, limit: 999999 });
			const ids = result.map(d => d._id);
			setAllFilteredIds(ids);
			setSelectedIds(ids);
			localStorage.setItem('selectedCarnetIds', JSON.stringify(ids));
      localStorage.setItem('selectedCarnets', JSON.stringify(result));
		} catch (e) {
			console.error(e);
		} finally {
			setSelectingAllFiltered(false);
		}
	};



  return (
    <div className="flex flex-col rounded-tl-xl border border-gray-300 shadow-md overflow-hidden relative overflow-y-auto">
      {loading ? <Loading /> : (
        <div className="flex flex-col flex-1 overflow-hidden">

          {selectedIds.length > 0 && (
            <div className="sticky top-0 bg-[#0f172a] text-white px-4 py-2 text-xs border-b border-gray-700 z-20 transition-all duration-300 ease-in-out">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="transition-all duration-300 ease-in-out">
                  Seleccionados: <strong>{selectedIds.length}</strong>
                </span>
                <div className="flex gap-3">
                  {(allFilteredIds.length === 0 && selectedIds.length === visibleIds.length) && (
                    <Button
                      variant="text"
                      sx={{ color: '#3b82f6', textTransform: 'none' }}
                      onClick={handleSelectAllFiltered}
                      disabled={selectingAllFiltered}
                    >
                      Seleccionar todos los carnets filtrados
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}

          <TableContainer
            className="h-full overflow-auto"
            sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}
          >
            <Table stickyHeader className="min-w-full" sx={{ flex: '1 1 auto' }}>
              <TableHead>
                <TableRow>
                  {['Nombre', 'DNI', 'Titulación', 'Año', 'Estado', 'Impreso'].map(header => (
                    <TableCell
                      key={header}
                      sx={headerStyle}
                    >
                      {header}
                    </TableCell>
                  ))}
                  <TableCell
                    align="right"
                    sx={{ ...headerStyle, zIndex: 2 }}
                  >
                    <Checkbox
                      checked={allVisibleSelected}
                      onChange={handleToggleSelectAllVisible}
                      sx={{ color: 'white' }}
                    />
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {nodes.map((item, index) => (
                  <TableRow key={item.id} sx={{ backgroundColor: index % 2 === 0 ? '#ffffff' : '#E5E9EC', transition: 'background-color 0.3s ease-in-out', height: '40px', maxHeight: '40px' }}>
                    <TableCell sx={compactCellStyle}>{item.fullName}</TableCell>
                    <TableCell sx={compactCellStyle}>{item.dni}</TableCell>
                    <TableCell sx={compactCellStyle}>{item.titulacion}</TableCell>
                    <TableCell sx={compactCellStyle}>{item.year}</TableCell>
                    <TableCell sx={compactCellStyle}>
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-sm font-bold">
                      {item.validationState === 'NO VÁLIDO' && <AlertIcon/>}
                      {item.validationState}
                    </span>

                    </TableCell>
                    <TableCell sx={compactCellStyle}>
                      <span className={`px-2 leading-tight rounded-sm font-bold`}>
                        {item.printed ? 'Sí' : 'No'}
                      </span>
                    </TableCell>
                    <TableCell sx={compactCellStyle} align="right">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          title="Ver carnet"
                          onClick={() => {
                            localStorage.setItem('currentCarnet', JSON.stringify(item));
                            router.push(`/dashboard/carnet/${item.id}`);
                          }}
                          className="flex items-center justify-center w-6 h-6 rounded-full bg-white hover:scale-110 shadow-lg hover:shadow-lg transition-all duration-300"
                        >
                          <Eye className="w-4 h-4 text-blue-600" />
                        </button>
                        <Checkbox
                          size="small"
                          sx={{ p: '4px', color: '#3b82f6', '&.Mui-checked': { color: '#3b82f6' } }}
                          checked={selectedIds.includes(item.id)}
                          onChange={() => handleToggleId(item.id)}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}

                {hasMoreData && (
                  <TableRow>
                    <TableCell colSpan={8}>
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
        </div>
      )}
    </div>
  );
}
