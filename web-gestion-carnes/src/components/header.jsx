"use client";

import { useEffect, useState } from "react";
import { Search, User, Printer, LogOut } from "@deemlol/next-icons";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { deleteAuthToken } from "@/services/tokenHandler";

export default function Header({ selectedIds, hideSearch = false, hidePrint = false, onSearch }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [clientMounted, setClientMounted] = useState(false);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    setClientMounted(true);
  }, []);

  const router = useRouter();

  const handleLogout = () => {
    deleteAuthToken();
    if (router) {
      router.push("/");
    }
  };

  const handlePrint = (selectedIds) => {
    console.log("Imprimiendo los carnets con IDs:", selectedIds);
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      const input = searchText.trim();
      const filters = {};

      if (/^\d+$/.test(input)) {
        filters.dni = input;
      } else {
        filters.fullName = input;
      }

      if (onSearch) {
        onSearch({
          ...filters,
          limit: 30
        });
      }
    }, 400);

    return () => clearTimeout(delay);
  }, [searchText]);

  return (
    <header>
      <div className="fixed top-0 left-0 right-0 h-16 bg-[#0864ec] shadow-md z-50 px-6 flex items-center justify-between text-white">
        {/* IZQUIERDA: LOGO + BUSCADOR */}
        <div className="flex items-center gap-6">
          <div className="w-28 h-auto">
            <Image
              src="/LOGO_U.png"
              alt="Logo"
              width={50}
              height={20}
              priority
            />
          </div>

          {/* Buscador, oculto si hideSearch === true */}
          {!hideSearch && (
            <div className="flex items-center border-b border-white px-2 w-64">
              <Search className="text-white mr-2 w-5 h-5" />
              <input
                type="text"
                placeholder="BUSCADOR"
                className="outline-none bg-transparent flex-grow text-sm text-white placeholder-white"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>
          )}
        </div>

        {/* DERECHA: BOTONES */}
        <div className="flex items-center gap-3 relative">
          {/* Botón IMPRIMIR, oculto si hidePrint === true */}
          {!hidePrint && (
            <button
              className="flex items-center bg-white text-[#0864ec] px-4 py-2 rounded-md hover:bg-gray-100 transition text-sm font-semibold"
              onClick={() => handlePrint(selectedIds)}
            >
              IMPRIMIR
              <Printer className="ml-2 w-5 h-5" />
            </button>
          )}

          {/* Botón USUARIO + Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center bg-white text-[#0864ec] px-4 py-2 rounded-md hover:bg-gray-100 transition text-sm font-semibold"
            >
              Usuario
              <User className="ml-2 w-5 h-5" />
            </button>

            {/* Dropdown */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white shadow-md rounded-md border z-50">
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-gray-100 text-sm"
                >
                  Cerrar sesión
                  <LogOut className="ml-2 w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}