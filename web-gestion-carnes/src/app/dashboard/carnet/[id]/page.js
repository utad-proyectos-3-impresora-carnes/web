"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { getCardPreview } from "@/services/member";
import { get } from "http";

export default function CarnetPage() {
  const { id } = useParams();
  const router = useRouter();
  const [imageSrc, setImageSrc] = useState(null);
  const [loading, setLoading] = useState(true);


useEffect(() => {
  if (!id) {
    router.push("/dashboard");
    return;
  }

  const fetchCarnetImage = async () => {
    try {
      const response = await getCardPreview(id);
      const previewPath = response?.preview;

      if (previewPath && typeof previewPath === 'string') {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
        const imagePath = previewPath.startsWith("/") ? previewPath : `/${previewPath}`;
        const fullImageUrl = `${baseUrl}${imagePath}`;

        setImageSrc(fullImageUrl);

        console.log("Full Image URL:", fullImageUrl);
      } else {
        console.error("Error: respuesta inesperada al obtener el carnet", response);
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Error fetching carnet image:", error);
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  fetchCarnetImage();
}, [id, router]);

  

  if (loading) return <p>Cargando carnet...</p>;
  if (!imageSrc) return <p>Error cargando el carnet</p>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="bg-white shadow-md rounded-lg p-6 text-center">
        <h1 className="text-xl font-bold mb-4">Carnet de Usuario</h1>

        <Image
          src={imageSrc}
          alt="Carnet de usuario"
          width={320}
          height={0}
          layout="intrinsic"
          className="w-80 h-auto border rounded-lg shadow-md"
        />
      </div>

      <button
        onClick={() => router.push("/dashboard")}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
      >
        Volver al Dashboard
      </button>
    </div>
  );
}
