"use client";

import { useRef } from "react";
import ArtworkImage from "./ArtworkImage";

// The site's signature interaction: a warm radial glow that follows the
// cursor over the featured artwork, like a gallery spotlight. Purely a
// CSS custom-property update on mousemove — no layout thrash — and it's
// hidden entirely under prefers-reduced-motion via CSS (see globals.css).
export default function SpotlightImage({ src, alt, width, height, className = "" }) {
  const frameRef = useRef(null);

  function handleMouseMove(e) {
    const el = frameRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    el.style.setProperty("--spot-x", `${x}%`);
    el.style.setProperty("--spot-y", `${y}%`);
  }

  return (
    <div
      ref={frameRef}
      onMouseMove={handleMouseMove}
      className={`spotlight-frame relative overflow-hidden ${className}`}
    >
      <ArtworkImage
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority
        className="h-full w-full object-cover"
      />
      <div className="spotlight-glow pointer-events-none absolute inset-0" />
    </div>
  );
}
