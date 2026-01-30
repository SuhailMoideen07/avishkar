"use client";

import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";
import { usePathname } from "next/navigation";

export default function LenisProvider({ children }) {
  const pathname = usePathname();

  useEffect(() => {
    const lenis = new Lenis({ smooth: true });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    requestAnimationFrame(() => window.scrollTo(0, 0));
  }, [pathname]);

  return children;
}
