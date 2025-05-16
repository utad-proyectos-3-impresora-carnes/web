"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Checkbox
} from '@mui/material';
import AlertIcon from '@/components/icons/AlertIcon';

export default function CarnetTable2() {
  const router = useRouter();

  const [selectedPrintedIds, setSelectedPrintedIds] = useState([]);
  const [itemsState, setItemsState] = useState([]);
  const [currentId, setCurrentId] = useState(null);

  useEffect(() => {
    const items = localStorage.getItem('selectedCarnets');
    const parsedItems = items ? JSON.parse(items) : [];

    const current = localStorage.getItem('currentCarnet');
    const currentParsed = current ? JSON.parse(current) : null;
    const currentIdParsed = currentParsed?.id ?? null;
    setCurrentId(currentIdParsed);

    const exists = currentParsed && parsedItems.some(i => i.id === currentParsed.id);

    let updatedItems;
    if (currentParsed) {
      updatedItems = exists
        ? [currentParsed, ...parsedItems.filter(i => i.id !== currentParsed.id)]
        : [currentParsed, ...parsedItems];
    } else {
      updatedItems = parsedItems;
    }

    setItemsState(updatedItems);
    localStorage.setItem('selectedCarnets', JSON.stringify(updatedItems));
  }, []);

  const compactCellStyle = {
    fontWeight: 'bold',
    fontSize: '1rem',
    padding: '6px 16px',
  };

  const headerStyle = {
    backgroundColor: '#0f172a',
    color: 'white',
    fontWeight: 'bold',
    position: 'sticky',
    top: 0,
    zIndex: 1,
    padding: '6px 16px',
    fontSize: '1rem',
    transition: 'all 0.3s ease-in-out',
  };

  return (
    <div className="w-[750px] h-[965px] ml-[-32px] pt-4 pr-4 pb-4 pl-8 gap-6 font-bold ">
      <TableContainer className="rounded-tr-lg">
        <Table stickyHeader sx={{ borderCollapse: 'collapse' }}>
          <TableHead>
            <TableRow>
              <TableCell
                colSpan={3}
                align="center"
                sx={{ ...headerStyle, borderBottom: 'none' }}
              >
                SELECCIÓN PARA REVISAR
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell
                align="left"
                sx={{ ...headerStyle, borderBottom: '1px solid #0f172a' }}
              >
                Nombre y apellidos
              </TableCell>
              <TableCell
                align="left"
                sx={{ ...headerStyle, borderBottom: '1px solid #0f172a' }}
              >
                Estado
              </TableCell>
              <TableCell
                align="right"
                sx={{ ...headerStyle, borderBottom: '1px solid #0f172a' }}
              >
                <Checkbox
                  size="small"
                  sx={{
                    p: '4px',
                    color: '#ffffff',
                    '&.Mui-checked': { color: '#3b82f6' },
                  }}
                  checked={selectedPrintedIds.length === itemsState.length}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedPrintedIds(itemsState.map(item => String(item.id)));
                    } else {
                      setSelectedPrintedIds([]);
                    }
                  }}
                />
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {itemsState.map((item, index) => {
              const isCurrent = String(item.id) === currentId;
              return (
                <TableRow
                  key={item.id}
                  hover
                  onClick={(e) => {
                    if (e.target.nodeName !== 'INPUT' && e.target.nodeName !== 'svg' && e.target.nodeName !== 'path') {
                      localStorage.setItem('currentCarnet', JSON.stringify(item));
                      router.push(`/dashboard/carnet/${item.id}`);
                    }
                  }}
                  sx={{
                    backgroundColor: isCurrent ? '#0065EF' : index % 2 === 1 ? '#ffffff' : '#E5E9EC',
                    color: isCurrent ? '#ffffff' : 'inherit',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s ease-in-out',
                    height: '40px',
                    maxHeight: '40px'
                  }}
                >
                  <TableCell align="left" sx={{ ...compactCellStyle, color: isCurrent ? '#ffffff' : '#000000' }}>
                    {item.fullName}
                  </TableCell>
                  <TableCell align="left" sx={{ ...compactCellStyle, color: isCurrent ? '#ffffff' : '#000000' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      {item.validationState === 'NO VÁLIDO' && <AlertIcon />}
                      {item.validationState}
                    </span>
                  </TableCell>
                  <TableCell align="right" sx={compactCellStyle}>
                    <Checkbox
                      size="small"
                      sx={{
                        p: '4px',
                        color: isCurrent ? '#ffffff' : '#0065EF',
                        '&.Mui-checked': { color: '#ffffff' },
                      }}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedPrintedIds(prev => Array.from(new Set([...prev, String(item.id)])));
                        } else {
                          setSelectedPrintedIds(prev => prev.filter(id => id !== String(item.id)));
                        }
                      }}
                      checked={selectedPrintedIds.includes(String(item.id))}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}