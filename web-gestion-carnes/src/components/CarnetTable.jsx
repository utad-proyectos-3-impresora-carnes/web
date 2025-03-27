'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from '@tanstack/react-table';
import { Eye } from '@deemlol/next-icons';

export default function CarnetTable({ data, loading }) {
  const router = useRouter();
  const observerRef = useRef();

  const [itemsToShow, setItemsToShow] = useState(30);
  const [visibleData, setVisibleData] = useState([]);

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

    return () => {
      if (observerRef.current) observer.unobserve(observerRef.current);
    };
  }, [itemsToShow, data.length]);

  const viewCarnet = (id) => {
    console.log('Ver carnet de', id);
    router.push(`/dashboard/carnet/${id}`);
  };

  const columns = React.useMemo(
    () => [
      {
        accessorKey: 'fullName',
        header: 'Nombre',
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'dni',
        header: 'DNI',
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'group.name',
        header: 'Edad',
        cell: (info) => info.row.original.group?.name || '',
      },
      {
        id: 'actions',
        header: () => (
          <div className="flex items-center justify-end gap-3">
            <Eye className="w-5 h-5 text-gray-600" />
            <input type="checkbox" className="w-5 h-5 cursor-pointer" />
          </div>
        ),
        cell: ({ row }) => (
          <div className="flex items-center justify-end gap-3">
            <button onClick={() => viewCarnet(row.original._id)}>
              <Eye className="w-5 h-5 text-gray-600 cursor-pointer" />
            </button>
            <input type="checkbox" className="w-5 h-5 cursor-pointer" />
          </div>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: visibleData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="overflow-x-auto">
      {loading ? (
        <p className="text-center py-4">Cargando...</p>
      ) : (
        <>
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead className="bg-gray-200">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider"
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="odd:bg-white even:bg-gray-100 border-b"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="border border-gray-300 px-4 py-2 text-sm text-gray-800"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          {/* Observador para carga progresiva */}
          <div ref={observerRef} className="h-10" />

          {itemsToShow < data.length && (
            <p className="text-center text-sm mt-2 text-gray-500">
              Cargando más carnets...
            </p>
          )}
        </>
      )}
    </div>
  );
}
