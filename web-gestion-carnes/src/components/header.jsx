"use client";

import { Search } from "@deemlol/next-icons";
import { User } from "@deemlol/next-icons";
import { Printer } from "@deemlol/next-icons";

export default function Header() {
  return (
    <header className="bg-gray-100 px-6 py-3 shadow-md">
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
        <div className="flex items-center gap-3">
          <button className="flex items-center bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition">
            IMPRIMIR <Printer className="ml-2 w-5 h-5" />
          </button>
          <button className="flex items-center border border-gray-400 px-4 py-2 rounded-md hover:bg-gray-200 transition">
            Usuario <User className="ml-2 w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
