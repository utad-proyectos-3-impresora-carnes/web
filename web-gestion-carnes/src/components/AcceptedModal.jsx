"use client";

import { X } from "@deemlol/next-icons";
import AlertIcon from "./icons/AlertIcon";

export default function AcceptedModal({ onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white rounded-[8px] w-[473px] h-[204px] p-6 flex flex-col justify-between border border-blue-200">
        <div className="flex justify-between items-start">
          <div className="flex gap-2 items-center">
            <AlertIcon />
            <h2 className="text-lg font-bold text-black">CAMBIO DE ESTADO</h2>
          </div>
          <button onClick={onClose}>
            <X className="w-5 h-5 text-black" />
          </button>
        </div>

        <p className="text-lg font-medium text-black mt-2">
          Va a cambiar el estado de este carnet. ¿Está seguro?
        </p>

        <div className="flex gap-4 mt-6">
          <button
            onClick={onClose}
            className="w-[185px] h-[45px] border border-[#0065EF] text-[#0065EF] font-bold rounded-md hover:bg-blue-50"
          >
            MANTENER ESTADO
          </button>
          <button
            onClick={onConfirm}
            className="w-[185px] h-[45px] bg-[#0065EF] text-white font-bold rounded-md hover:opacity-90"
          >
            CAMBIAR ESTADO
          </button>
        </div>
      </div>
    </div>
  );
}
