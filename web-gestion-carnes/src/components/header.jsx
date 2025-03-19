"use client";

import { useEffect, useState } from "react";
import { Search, User, Printer, LogOut } from "@deemlol/next-icons";
import { useRouter } from "next/navigation";

export default function Header() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [clientMounted, setClientMounted] = useState(false);
  
  useEffect(() => {
    setClientMounted(true);
  }, []);

  const router = clientMounted ? useRouter() : null;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userID");

    if (router) {
      router.push("/"); // Redirige al login
    }
  };

  return (
    <header className="bg-gray-100 px-6 py-3 shadow-md relative">
      <div className="flex items-center justify-between">
        
        {/* LOGO + BUSCADOR */}
        <div className="flex items-center gap-6">
          <div className="text-2xl font-bold">LOGO</div>

          <div className="flex items-center border-b border-gray-400 px-2 w-64">
            <Search className="text-gray-500 mr-2 w-5 h-5" />
            <input
              type="text"
              placeholder="BUSCADOR"
              className="outline-none bg-transparent flex-grow"
            />
          </div>
        </div>

        {/* BOTONES */}
        <div className="flex items-center gap-3 relative">
          <button className="flex items-center bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition">
            IMPRIMIR <Printer className="ml-2 w-5 h-5" />
          </button>

          {/* BOTÓN DE USUARIO */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center border border-gray-400 px-4 py-2 rounded-md hover:bg-gray-200 transition"
            >
              Usuario <User className="ml-2 w-5 h-5" />
            </button>

            {/* DROPDOWN */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white shadow-md rounded-md border">
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-gray-100"
                >
                  Cerrar sesión <LogOut className="ml-2 w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
