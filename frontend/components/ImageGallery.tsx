"use client";

import { useState } from "react";
import { ZoomIn } from "lucide-react";

interface ImageGalleryProps {
  images: string;
}

export default function ImageGallery({ images }: ImageGalleryProps) {
  const imageUrls = images.split(",").map((url) => url.trim());
  const [activeImage, setActiveImage] = useState(imageUrls[0]);
  const [zoomStyle, setZoomStyle] = useState({ display: "none", backgroundPosition: "0% 0%" });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left - window.scrollX) / width) * 100;
    const y = ((e.pageY - top - window.scrollY) / height) * 100;
    setZoomStyle({
      display: "block",
      backgroundPosition: `${x}% ${y}%`,
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({ display: "none", backgroundPosition: "0% 0%" });
  };

  return (
    <div className="flex flex-col space-y-4">
      {/* Main Image Inspector with Zoom */}
      <div 
        className="relative group aspect-4/3 overflow-hidden rounded-xl bg-zinc-900 border border-gold/15 cursor-crosshair"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={activeImage}
          alt="Luxury product detail inspection"
          className="h-full w-full object-cover transition-opacity duration-300 group-hover:opacity-0"
        />

        {/* Hover Magnifying Zoom Viewport */}
        <div
          className="absolute inset-0 bg-no-repeat pointer-events-none rounded-xl"
          style={{
            ...zoomStyle,
            backgroundImage: `url(${activeImage})`,
            backgroundSize: "200%",
          }}
        />

        <div className="absolute bottom-4 left-4 z-10 flex items-center space-x-1.5 bg-background/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-gold/10 text-gold text-xs font-semibold">
          <ZoomIn className="h-3.5 w-3.5" />
          <span>Hover to zoom (200% forensics)</span>
        </div>
      </div>

      {/* Thumbnails list */}
      {imageUrls.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {imageUrls.map((url, idx) => (
            <button
              key={idx}
              onClick={() => setActiveImage(url)}
              className={`relative aspect-4/3 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 bg-zinc-900 cursor-pointer ${
                activeImage === url ? "border-gold" : "border-gold/10 hover:border-gold/30"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt="Product thumbnail"
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
