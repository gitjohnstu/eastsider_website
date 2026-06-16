"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { cityList } from "@/config/city";

interface CityDropdownProps {
  currentSlug: string;
  currentName: string;
  currentState: string;
}

export function CityDropdown({ currentSlug, currentName, currentState }: CityDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex items-center gap-2 rounded px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.3em] border border-white/15 text-white/70 transition hover:border-white/35 hover:text-white"
      >
        <span className="text-[#c49040]">✦</span>
        {currentName}, {currentState}
        <span className="text-white/35">{open ? "▴" : "▾"}</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-52 overflow-hidden rounded-sm border border-white/10 bg-stone-900 shadow-xl shadow-black/40 z-50">
          {cityList.map((city) => {
            const isCurrent = city.slug === currentSlug;
            return (
              <Link
                key={city.slug}
                href={`/${city.slug}`}
                onClick={() => setOpen(false)}
                className={`flex items-center justify-between px-5 py-3.5 text-sm transition ${
                  isCurrent
                    ? "bg-white/5 text-white"
                    : "text-stone-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <span>
                  <span className="font-medium">{city.name}</span>
                  <span className="ml-2 text-xs text-stone-600">{city.state}</span>
                </span>
                {isCurrent && <span className="text-[#c49040] text-xs">✓</span>}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
