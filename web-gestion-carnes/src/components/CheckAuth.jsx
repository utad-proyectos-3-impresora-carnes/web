"use client"; // Se ejecuta solo en el cliente

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CheckAuth({ currentPath }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return; // Evita ejecución en SSR

    const verifyToken = async () => {
      const token = localStorage.getItem("token");

      const isAuthPage = currentPath === "/" || currentPath === "/register";

      if (!token) {
        if (!isAuthPage) {
          router.push("/");
        }
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/getUserByToken`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Token inválido o usuario no encontrado");
        }

        const userData = await response.json();
        console.log("Usuario autenticado:", userData);

        // ✅ SI ESTÁ EN LOGIN Y YA TIENE TOKEN, REDIRIGIR AL DASHBOARD
        if (isAuthPage) {
          router.push("/dashboard");
        }
      } catch (error) {
        console.error("Error de autenticación:", error);
        localStorage.removeItem("token");
        router.push("/");
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [currentPath]); // Se ejecuta cuando cambia la ruta

  return loading ? <p>Cargando...</p> : null;
}
