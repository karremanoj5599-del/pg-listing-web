"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { MapPin, Star } from "lucide-react";
import Link from "next/link";
import React, { useRef } from "react";

interface PropertyCardProps {
  property: {
    id: number;
    name: string;
    type: string;
    price: string;
    rating: number;
    location: string;
    image: string;
    amenities: React.ReactNode[];
  };
  index: number;
}

export default function PropertyCard({ property, index }: PropertyCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 25 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 25 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ 
        delay: index * 0.1, 
        type: "spring", 
        stiffness: 100, 
        damping: 20 
      }}
      style={{ perspective: 1000 }}
      className="interactive-card h-full"
    >
      <Link href={`/properties/${property.id}`} className="block h-full">
        <motion.div
          ref={ref}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          className="glass-card p-3 h-full flex flex-col transition-shadow duration-500 hover:shadow-[0_30px_50px_-20px_rgba(224,122,95,0.25)] hover:border-terracotta/30 group"
        >
          {/* Image Container with Reveal and Inner Parallax */}
          <div className="relative h-64 rounded-xl overflow-hidden mb-5">
            <motion.div
              className="absolute inset-0 bg-terracotta z-10 origin-bottom"
              initial={{ scaleY: 1 }}
              whileInView={{ scaleY: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: index * 0.1 + 0.2 }}
            />
            <motion.img 
              src={property.image} 
              alt={property.name} 
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
              style={{ transform: "translateZ(50px)" }}
            />
            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold text-forest shadow-sm transform transition-transform duration-500 group-hover:-translate-y-1">
              {property.type}
            </div>
            <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 text-sm font-bold text-forest shadow-sm transform transition-transform duration-500 group-hover:-translate-y-1">
              <Star size={14} className="fill-yellow-400 text-yellow-400" /> {property.rating}
            </div>
          </div>
          
          <div className="px-2 flex flex-col flex-1 transform-style-3d">
            <div className="flex justify-between items-start mb-2" style={{ transform: "translateZ(30px)" }}>
              <h3 className="font-heading font-bold text-lg text-forest group-hover:text-terracotta transition-colors">{property.name}</h3>
              <p className="font-bold text-terracotta bg-terracotta/10 px-2 py-1 rounded-lg">{property.price}</p>
            </div>
            <p className="text-sm text-forest/60 mb-4 flex items-center gap-1" style={{ transform: "translateZ(20px)" }}>
              <MapPin size={14} /> {property.location}
            </p>
            <div className="mt-auto pt-4 border-t border-forest/5 flex items-center justify-between" style={{ transform: "translateZ(40px)" }}>
              <div className="flex gap-2 text-forest/40">
                {property.amenities.map((icon, i) => (
                  <span key={i} className="bg-forest/5 p-1.5 rounded-md text-forest/70 group-hover:bg-terracotta/10 group-hover:text-terracotta transition-colors duration-300">
                    {icon}
                  </span>
                ))}
              </div>
              <div className="overflow-hidden relative">
                 <span className="inline-block text-sm font-medium text-forest group-hover:-translate-y-full transition-transform duration-300">
                  View Details
                </span>
                <span className="absolute top-full left-0 text-sm font-medium text-terracotta group-hover:-translate-y-full transition-transform duration-300 flex items-center gap-1">
                  Book Now &rarr;
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}
