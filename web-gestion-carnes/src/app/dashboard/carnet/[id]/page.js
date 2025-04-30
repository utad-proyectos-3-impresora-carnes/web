"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Header from "@/components/header";
import { getCardPreview, getFilteredMembers } from "@/services/member";

export default function CarnetPage() {
  const { id } = useParams();
  const router = useRouter();

  const [imageSrc, setImageSrc] = useState(null);
  const [memberData, setMemberData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        // Imagen
        const previewData = await getCardPreview(id);
        const fullImageUrl = `${process.env.NEXT_PUBLIC_API_URL}/${previewData.preview}`;
        setImageSrc(fullImageUrl);

        // Datos del carnet
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

  const estadoFormateado = memberData.validationState === "validated"
    ? "VALIDADO"
    : memberData.validationState === "rejected"
    ? "NO VÁLIDO"
    : "POR VALIDAR";

  return (
    <>
      <Header selectedIds={[]} hideSearch hidePrint />

      <div className="flex flex-col items-center justify-center py-12 px-4 bg-gray-50 min-h-screen">
        <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-xl text-center">

          {/* Información del carnet */}
          <div className="mb-6 text-left text-gray-700 space-y-1">
            <p><strong>Nombre completo:</strong> {memberData.fullName}</p>
            <p><strong>Titulación:</strong> {memberData.group?.name || "—"}</p>
            <p><strong>Año:</strong> {memberData.creationYear || "—"}</p>
            <p><strong>Estado:</strong> {estadoFormateado}</p>
            <p><strong>Impreso:</strong> {memberData.printed ? "Sí" : "No"}</p>
          </div>

          {/* Imagen del carnet */}
          <Image
            src={imageSrc}
            alt="Carnet de usuario"
            width={320}
            height={0}
            layout="intrinsic"
            className="w-80 h-auto border rounded-lg shadow-md mx-auto"
          />
        </div>

        <button
          onClick={() => router.push("/dashboard")}
          className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition"
        >
          Volver al Dashboard
        </button>
      </div>
    </>
  );
}
