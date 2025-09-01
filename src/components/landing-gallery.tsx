'use client';

import { useState } from 'react';
import Image from 'next/image';

// List of all images from the public directory
const LANDING_IMAGES = [
  { id: 'anime', src: '/anime.png', alt: 'Anime style artwork' },
  { id: 'banana', src: '/banana.jpeg', alt: 'Banana artwork' },
  { id: 'banner', src: '/banner.png', alt: 'Banner design' },
  { id: 'future', src: '/future.png', alt: 'Futuristic cityscape' },
  { id: 'futuristic', src: '/futuristic.png', alt: 'Futuristic artwork' },
  { id: 'girl', src: '/girl.png', alt: 'Portrait artwork' },
  { id: 'hero', src: '/hero.webp', alt: 'Hero image' },
  { id: 'insta', src: '/insta.webp', alt: 'Instagram style post' },
  { id: 'modelwars2', src: '/modelwars2.png', alt: 'Model artwork' },
  { id: 'phone', src: '/phone.jpg', alt: 'Phone mockup' },
];

export function LandingGallery() {
  const [hoveredImage, setHoveredImage] = useState<string | null>(null);

  return (
    <div className="h-full flex items-center justify-center py-8">
      <div className="max-w-7xl mx-auto px-4 w-full">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Gallery of Creations</h2>
          <p className="text-muted-foreground">Explore AI-generated masterpieces from our community</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {LANDING_IMAGES.map((image) => (
            <div 
              key={image.id}
              className="relative aspect-square overflow-hidden rounded-lg group"
              onMouseEnter={() => setHoveredImage(image.id)}
              onMouseLeave={() => setHoveredImage(null)}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className={`object-cover transition-all duration-300 ${
                  hoveredImage === image.id ? 'scale-105' : ''
                }`}
                sizes="(max-width: 768px) 50vw, 25vw"
                priority={image.id === 'hero'} // Only preload the hero image
              />
              <div 
                className={`absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4 ${
                  hoveredImage === image.id ? 'opacity-100' : ''
                }`}
              >
                <span className="text-white text-sm font-medium truncate">
                  {image.alt}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
