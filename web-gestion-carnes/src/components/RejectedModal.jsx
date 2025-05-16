import { useState } from "react";
import { X, AlertTriangle } from "lucide-react";
import AlertIcon from "./icons/AlertIcon";

export default function CarnetRejectModal({ onClose, onSend }) {
  const [reason, setReason] = useState("imagen");
  const [customReason, setCustomReason] = useState("");
  const [error, setError] = useState("");

  const handleSend = () => {
    if (reason === "otros" && customReason.trim() === "") {
      setError("Debe ingresar un motivo.");
      return;
    }
    setError("");
    onSend(reason === "otros" ? customReason : reason);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="w-[550px] h-[450px] bg-white rounded-xl shadow-lg p-8 flex flex-col relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-black">
          <X className="w-6 h-6" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <AlertIcon/>
          <h2 className="text-xl font-bold">CARNET RECHAZADO</h2>
        </div>

        <p className="text-gray-800 mb-2">Este documento no ha sido validado.</p>
        <p className="text-gray-800 mb-6">
          Para continuar, selecciona el motivo. Se enviará automáticamente un correo al alumno con esta información y se eliminará el carnet de la cola de impresión.
        </p>

        <div className="space-y-4">
          <p className="font-semibold">Seleccione motivo:</p>

          <label className="flex items-center gap-3">
            <input
              type="radio"
              name="reason"
              value="imagen"
              checked={reason === "imagen"}
              onChange={() => setReason("imagen")}
              className="accent-blue-600 w-5 h-5"
            />
            Imagen no valida
          </label>

          <label className="flex items-center gap-3">
            <input
              type="radio"
              name="reason"
              value="otros"
              checked={reason === "otros"}
              onChange={() => setReason("otros")}
              className="accent-blue-600 w-5 h-5"
            />
            Otros
          </label>

          {reason === "otros" && (
            <>
              <input
                type="text"
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder="Especifique el motivo..."
                className="mt-2 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              {error && <p className="text-red-500 text-sm font-medium mt-1">{error}</p>}
            </>
          )}
        </div>

        <div className="flex justify-end gap-5 mt-auto">
          <button
            className="w-[156px] h-[55px] border-2 border-blue-600 text-blue-600 rounded-md text-sm font-bold hover:bg-blue-50"
            onClick={onClose}
          >
            CANCELAR
          </button>

          <button
            className="w-[95px] h-[55px] bg-blue-600 text-white rounded-md text-sm font-bold hover:bg-blue-700"
            onClick={handleSend}
          >
            ENVIAR
          </button>
        </div>
      </div>
    </div>
  );
}
