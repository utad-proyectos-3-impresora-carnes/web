import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export default function FilterSidebar({ onApply }) {
  const [titulacion, setTitulacion] = useState("");
  const [anioAcademico, setAnioAcademico] = useState("");
  const [tipoDocumento, setTipoDocumento] = useState("");

  const handleApply = () => {
    onApply({ titulacion, anioAcademico, tipoDocumento });
  };

  return (
    <div className="w-64 p-4 bg-gray-100 border-r border-gray-300 space-y-4">
      <h2 className="text-lg font-semibold">Filtros</h2>
      
      {/* Filtro de Titulación */}
      <div>
        <label className="text-sm font-medium">Titulación</label>
        <Input
          type="text"
          placeholder="Buscar titulación..."
          value={titulacion}
          onChange={(e) => setTitulacion(e.target.value)}
          className="mt-1"
        />
      </div>

      {/* Filtro de Año Académico */}
      <div>
        <label className="text-sm font-medium">Año Académico</label>
        <Input
          type="text"
          placeholder="Buscar año..."
          value={anioAcademico}
          onChange={(e) => setAnioAcademico(e.target.value)}
          className="mt-1"
        />
      </div>

      {/* Filtro de Tipo de Documento */}
      <div>
        <label className="text-sm font-medium">Tipo de Documento</label>
        <Select value={tipoDocumento} onValueChange={setTipoDocumento}>
          <SelectTrigger>
            <SelectValue placeholder="Selecciona un tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="online">Online</SelectItem>
            <SelectItem value="fisico">Fisico</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Botón Aplicar */}
      <Button onClick={handleApply} className="w-full mt-4">
        Aplicar
      </Button>
    </div>
  );
}
