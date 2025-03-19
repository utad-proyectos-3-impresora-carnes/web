"use client";

import { usePathname } from "next/navigation";
import CheckAuth from "./CheckAuth";

export default function PathProvider() {
  const pathname = usePathname(); 

  return <CheckAuth currentPath={pathname} />;
}
