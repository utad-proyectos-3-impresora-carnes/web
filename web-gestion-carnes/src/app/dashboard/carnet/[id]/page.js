"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";

export default function CarnetPage() {
  const { id } = useParams();
  const router = useRouter();
  const [imageSrc, setImageSrc] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchCarnetImage = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No hay token en localStorage");
          router.push("/");
          return;
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/member/preview/${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (!response.ok) {
          if (response.status === 401) {
            console.error("No autorizado. Redirigiendo...");
            router.push("/");
            return;
          }
          throw new Error(`No se pudo cargar la imagen del carnet (Error ${response.status})`);
        }

        const data = await response.json();
        if (!data.preview) {
          console.error("No se recibió imagen.");
          router.push("/dashboard");
          return;
        }

        const fullImageUrl = `${process.env.NEXT_PUBLIC_API_URL}/${data.preview}`;
        setImageSrc(fullImageUrl);

      } catch (error) {
        console.error("Error al obtener la imagen:", error);
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
