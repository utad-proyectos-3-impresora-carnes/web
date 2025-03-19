"use client"; // Se ejecuta solo en el cliente

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function CheckAuth() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname(); // Ruta actual

  useEffect(() => {
    if (typeof window === "undefined") return; 

    // Solo ejecutamos CheckAuth una vez
    const alreadyChecked = sessionStorage.getItem("authChecked");
    if (alreadyChecked) {
      setLoading(false);
      return;
    }

    const verifyToken = async () => {
      const token = localStorage.getItem("token");
      const userID = localStorage.getItem("userID");

      const isAuthPage = pathname === "/" || pathname === "/register"; // No proteger login ni register

      if (!token || !userID) {
        if (!isAuthPage) {
          router.push("/");
        }
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/${userID}`, {
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

        // Guardamos en sessionStorage para no volver a verificar
        sessionStorage.setItem("authChecked", "true");
      } catch (error) {
        console.error("Error de autenticación:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("userID");
        router.push("/");
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, []); // Se ejecuta solo una vez

  return loading ? <p>Cargando...</p> : null;
}
