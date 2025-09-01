'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ASSET_TEMPLATES } from '@/lib/constants';

interface Template {
  id: string;
  name: string;
  category: string;
  description: string;
  imageSize: string;
  thumbnail: string;
}

const getImageForTemplate = (templateId: string) => {
  switch(templateId) {
    case 'portrait': return '/modelwars2.png';
    case 'landscape': return '/futuristic.png';
    case 'square': return '/insta.webp';
    case 'banner': return '/banner.png';
    case 'story': return '/phone.jpg';
    default: return '/hero.webp';
  }
};

export function TemplateGallery() {
  const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null);

  // Get unique categories
  const categories = ['All', ...new Set(ASSET_TEMPLATES.map(t => t.category))];
  const [activeCategory, setActiveCategory] = useState('All');

  // Filter templates by category
  const filteredTemplates = activeCategory === 'All' 
    ? ASSET_TEMPLATES 
    : ASSET_TEMPLATES.filter(t => t.category === activeCategory);

  return (
    <section className="w-full py-12 md:py-16 lg:py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Inspiration Gallery
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Browse through our collection of AI-generated images
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === category
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-accent hover:text-accent-foreground'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredTemplates.map((template) => (
            <div 
              key={template.id}
              className="relative group aspect-square overflow-hidden rounded-lg"
              onMouseEnter={() => setHoveredTemplate(template.id)}
              onMouseLeave={() => setHoveredTemplate(null)}
            >
              <Image
                src={getImageForTemplate(template.id)}
                alt={template.name}
                fill
                className={`object-cover transition-all duration-300 ${
                  hoveredTemplate === template.id ? 'scale-105' : ''
                }`}
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33.33vw, 20vw"
              />
              <div 
                className={`absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4 ${
                  hoveredTemplate === template.id ? 'opacity-100' : ''
                }`}
              >
                <span className="text-white text-sm font-medium truncate">
                  {template.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}