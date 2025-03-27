'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Eye } from '@deemlol/next-icons';
import { useRowSelect } from '@table-library/react-table-library/select';

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
    return () => observer.disconnect();
  }, [itemsToShow, data.length]);

  const handleViewCarnet = (id) => {
    router.push(`/dashboard/carnet/${id}`);
  };

  const nodes = visibleData.map((item) => ({
    id: item._id,
    fullName: item.fullName,
    dni: item.dni,
    ageGroup: item.group?.name || '',
  }));

  const dataTable = { nodes };

  const select = useRowSelect(dataTable, {
    onChange: () => {},
  });

  const selectedVisibleCount = nodes.filter((n) =>
    select.state.ids.includes(n.id)
  ).length;

  const totalSelectedCount = select.state.ids.length;
  const allVisibleSelected =
    nodes.length > 0 && selectedVisibleCount === nodes.length;

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-300 shadow-md">
      {loading ? (
        <p className="text-center py-4">Cargando...</p>
      ) : (
        <>
          <table className="table-auto w-full border-collapse px-0 border border-gray-300">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold uppercase">
                  Nombre
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold uppercase">
                  DNI
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold  uppercase">
                  Edad
                </th>
                <th className="border border-gray-300 px-4 py-2 text-right text-sm font-semibold uppercase">
                  <div className="flex justify-end items-center gap-3">
                    <Eye className="w-5 h-5" />
                    <input
                      type="checkbox"
                      className="w-5 h-5 cursor-pointer"
                      checked={allVisibleSelected}
                      onChange={() => select.fns.onToggleAll()}
                    />
                  </div>
                </th>
              </tr>
            </thead>

            {/* Notificación en la parte superior */}
            {selectedVisibleCount > 0 && (
              <tbody>
                <tr>
                  <td colSpan={4} className="bg-[#0f172a] text-white px-4 py-3 text-sm border-t border-b border-gray-700">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span>
                        Se han seleccionado{' '}
                        <span className="font-semibold">{selectedVisibleCount}</span>{' '}
                        carnets visibles.
                      </span>
                      {totalSelectedCount < data.length && (
                        <button
                          onClick={() => {
                            const allIds = data.map((item) => item._id);
                            select.fns.onAddAll(allIds);
                          }}
                          className="text-blue-400 hover:underline ml-2"
                        >
                          Seleccionar los {data.length} carnets en Para Imprimir
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              </tbody>
            )}

            <tbody>
              {nodes.map((item, index) => (
                <tr
                  key={item.id}
                  className={`border-b ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-100'
                  }`}
                >
                  <td className="border border-gray-300 px-4 py-2 text-sm text-gray-800">
                    {item.fullName}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-sm text-gray-800">
                    {item.dni}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-sm text-gray-800">
                    {item.ageGroup}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-sm text-gray-800">
                    <div className="flex items-center justify-end gap-3">
                      <button onClick={() => handleViewCarnet(item.id)}>
                        <Eye className="w-5 h-5 text-gray-600 cursor-pointer" />
                      </button>
                      <input
                        type="checkbox"
                        className="w-5 h-5 cursor-pointer"
                        checked={select.state.ids.includes(item.id)}
                        onChange={() => select.fns.onToggleById(item.id)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div ref={observerRef} className="h-10" />
          {itemsToShow < data.length && (
            <p className="text-center text-sm mt-2 text-gray-500 flex items-center justify-center gap-2">
              
              <span className="w-10 h-10">Cargando más carnets...</span>
            </p>

          )}
        </>
      )}
    </div>
  );
}
