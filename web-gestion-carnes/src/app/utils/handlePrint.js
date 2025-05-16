import { printMembers } from "@/services/member";

export const handlePrint = async (selectedIds) => {
  if (!Array.isArray(selectedIds) || selectedIds.length === 0) {
    alert("No hay carnets seleccionados para imprimir.");
    return null;
  }
  console.log("IDs seleccionados para imprimir:", selectedIds);

  try {
    const result = await printMembers(selectedIds);
    alert("Carnets enviados a imprimir. Revisa tu CardPresso.");
    return result;
  } catch (error) {
    console.error("Error al imprimir carnets:", error);
    alert("Hubo un problema al imprimir los carnets.");
    return null;
  }
};
