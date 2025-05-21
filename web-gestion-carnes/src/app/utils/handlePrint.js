import { printMembers } from "@/services/member";
import SimpleSnackbar from "@/components/modals/AlertModal";

export const handlePrint = async (selectedIds) => {
	if (!Array.isArray(selectedIds) || selectedIds.length === 0) {
		return <SimpleSnackbar alertText={"No hay carnets seleccionados para imprimir."} />;
	}
	console.log("IDs seleccionados para imprimir:", selectedIds);

	try {
		const result = await printMembers(selectedIds);
		return <SimpleSnackbar alertText={"Carnets enviados a imprimir. Revisa tu CardPresso."} />;
	} catch (error) {
		console.error("Error al imprimir carnets:", error);
		return <SimpleSnackbar alertText={"Hubo un problema al imprimir los carnets."} />;
	}
};
