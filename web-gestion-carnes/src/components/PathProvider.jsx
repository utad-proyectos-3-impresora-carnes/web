"use client";

import { usePathname } from "next/navigation";
import CheckAuth from "../services/CheckAuth";

export default function PathProvider() {
  const pathname = usePathname(); 

  return <CheckAuth currentPath={pathname} />;
}
