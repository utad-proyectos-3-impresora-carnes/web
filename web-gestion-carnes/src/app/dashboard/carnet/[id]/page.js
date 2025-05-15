"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Header from "@/components/header";
import {
  getCardPreview,
  getFilteredMembers,
  editMemberValidatioStatus,
} from "@/services/member";
import { Mail } from "@deemlol/next-icons";

export default function CarnetPage() {
  const { id } = useParams();
  const router = useRouter();

  const [imageSrc, setImageSrc] = useState(null);
  const [memberData, setMemberData] = useState(null);
  const [loading, setLoading] = useState(true);

  const currentData = JSON.parse(localStorage.getItem('currentCarnet'));

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const previewData = await getCardPreview(id);
        const fullImageUrl = `${process.env.NEXT_PUBLIC_API_URL}/${previewData.preview}`;
        setImageSrc(fullImageUrl);

        const res = await getFilteredMembers({ _id: id });
        if (res.length > 0) {
          setMemberData(res[0]);
        } else {
          throw new Error("Carnet no encontrado");
        }
      } catch (error) {
        console.error("Error al obtener el carnet:", error);
        router.push("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, router]);

  if (loading) return <p className="text-center mt-10">Cargando carnet...</p>;
  if (!imageSrc || !memberData) return <p>Error cargando el carnet</p>;

  return (
    <>
      <Header selectedIds={[]} hideSearch hidePrint />

      <div className="min-h-screen bg-gray-100 pt-20 px-6 flex flex-col items-center">
        {/* Contenedor principal */}
        <div className="w-full max-w-6xl mt-16 bg-white shadow-md rounded-lg p-6 flex flex-col lg:flex-row gap-6 justify-between">
          {/* Columna izquierda - Datos */}
          <div className="flex-1 space-y-4 text-left">
            <div>
              <p className="text-sm text-gray-500 font-semibold uppercase">Nombre completo</p>
              <p className="text-base font-medium">{currentData.fullName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-semibold uppercase">DNI</p>
              <p className="text-base font-medium">{currentData.dni}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-semibold uppercase">Titulación</p>
              <p className="text-base font-medium">{currentData.titulacion || "—"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-semibold uppercase">Año</p>
              <p className="text-base font-medium">{currentData.year || "—"}</p>
            </div>
          </div>

          {/* Columna derecha - Carnet + controles debajo */}
          <div className="flex-1 flex flex-col items-start gap-6">
            {/* Imagen */}
            <Image
              src={imageSrc}
              alt="Carnet de usuario"
              width={400}
              height={0}
              layout="intrinsic"
              className="rounded-lg shadow border w-full max-w-xs"
            />

            {/* Estado + notificación debajo, alineado a la izquierda */}
            <div className="w-full max-w-xs space-y-4">
              <div>
                <p className="text-sm font-semibold text-gray-800 mb-2">Estado del carnet</p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <label className="flex items-center gap-2 text-sm text-gray-700 font-medium">
                    <input
                      type="radio"
                      value="to_validate"
                      checked={memberData.validationState === "to_validate"}
                      onChange={async () => {
                        await editMemberValidatioStatus(id, "to_validate");
                        setMemberData((prev) => ({ ...prev, validationState: "to_validate" }));
                      }}
                    />
                    Por validar
                  </label>

                  <label className="flex items-center gap-2 text-sm text-gray-700 font-medium">
                    <input
                      type="radio"
                      value="rejected"
                      checked={memberData.validationState === "rejected"}
                      onChange={async () => {
                        await editMemberValidatioStatus(id, "rejected");
                        setMemberData((prev) => ({ ...prev, validationState: "rejected" }));
                      }}
                    />
                    No válido
                  </label>

                  <label className="flex items-center gap-2 text-sm text-gray-700 font-medium">
                    <input
                      type="radio"
                      value="validated"
                      checked={memberData.validationState === "validated"}
                      onChange={async () => {
                        await editMemberValidatioStatus(id, "validated");
                        setMemberData((prev) => ({ ...prev, validationState: "validated" }));
                      }}
                    />
                    Válido
                  </label>
                </div>
              </div>

              <button
                className="flex items-center justify-center gap-2 bg-gray-800 text-white px-5 py-2 rounded-md text-sm font-semibold hover:bg-gray-900 transition w-full"
                onClick={() => {
                  alert("Correo de notificación enviado (simulado)");
                }}
              >
                Notificar por correo
                <Mail className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Botón Dashboard más arriba */}
        <div className="mt-12">
          <button
            onClick={() => router.push("/dashboard")}
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition"
          >
            Dashboard
          </button>
        </div>
      </div>
    </>
  );
}
