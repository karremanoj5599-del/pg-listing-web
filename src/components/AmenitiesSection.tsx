"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Wifi, 
  Utensils, 
  Sparkles, 
  ShieldCheck, 
  Flame, 
  Droplet, 
  BatteryCharging, 
  Tv,
  AirVent,
  Bike
} from "lucide-react";

interface AmenityItem {
  id: string;
  name: string;
  category: "Comfort" | "Utility" | "Safety";
  icon: React.ReactNode;
  description: string;
  badge: "Essential" | "Premium" | "Standard";
}

export default function AmenitiesSection() {
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const amenities: AmenityItem[] = [
    {
      id: "wifi",
      name: "High-Speed Wi-Fi",
      category: "Utility",
      icon: <Wifi className="w-6 h-6" />,
      description: "Fiber internet with 100+ Mbps speed, perfect for work-from-home and entertainment.",
      badge: "Essential"
    },
    {
      id: "meals",
      name: "Nutritious Meals",
      category: "Comfort",
      icon: <Utensils className="w-6 h-6" />,
      description: "Freshly cooked hygienic breakfast, lunch, and dinner served in a cozy dining space.",
      badge: "Premium"
    },
    {
      id: "housekeeping",
      name: "Daily Housekeeping",
      category: "Comfort",
      icon: <Sparkles className="w-6 h-6" />,
      description: "Professional daily room cleaning and regular deep cleaning of common spaces.",
      badge: "Essential"
    },
    {
      id: "security",
      name: "3-Tier Security",
      category: "Safety",
      icon: <ShieldCheck className="w-6 h-6" />,
      description: "24/7 CCTV surveillance, smart biometric gate lock entry, and dedicated wardens.",
      badge: "Essential"
    },
    {
      id: "power",
      name: "24/7 Power Backup",
      category: "Utility",
      icon: <BatteryCharging className="w-6 h-6" />,
      description: "Heavy-duty power generators to ensure uninterrupted electricity for AC and gadgets.",
      badge: "Standard"
    },
    {
      id: "water",
      name: "Purified RO Water",
      category: "Utility",
      icon: <Droplet className="w-6 h-6" />,
      description: "RO + UV water purifiers on every floor, providing clean drinking water 24/7.",
      badge: "Essential"
    },
    {
      id: "hot-water",
      name: "Hot Water Geysers",
      category: "Utility",
      icon: <Flame className="w-6 h-6" />,
      description: "Dedicated water heaters in all attached washrooms for round-the-clock comfort.",
      badge: "Standard"
    },
    {
      id: "ac",
      name: "Fully Air Conditioned",
      category: "Comfort",
      icon: <AirVent className="w-6 h-6" />,
      description: "Premium energy-efficient split ACs in all premium sharing and private rooms.",
      badge: "Premium"
    },
    {
      id: "lounge",
      name: "Recreation & TV Lounge",
      category: "Comfort",
      icon: <Tv className="w-6 h-6" />,
      description: "Common lounge area with flat-screen smart TV, board games, and relaxing couches.",
      badge: "Standard"
    },
    {
      id: "parking",
      name: "Secure Bike Parking",
      category: "Safety",
      icon: <Bike className="w-6 h-6" />,
      description: "Dedicated covered two-wheeler parking space inside the gated boundaries.",
      badge: "Standard"
    }
  ];

  const categories = ["All", "Comfort", "Utility", "Safety"];

  const filteredAmenities = activeCategory === "All" 
    ? amenities 
    : amenities.filter(item => item.category === activeCategory);

  return (
    <section id="amenities" className="py-24 px-6 md:px-12 max-w-[1536px] mx-auto scroll-mt-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <span className="text-xs uppercase tracking-widest text-[rgba(20,40,75,0.6)] font-bold mb-2 block">
            Premium Living
          </span>
          <h2 className="text-3xl md:text-5xl font-normal text-[#3A3F4A] tracking-tight">
            PG Accommodations & Amenities
          </h2>
          <p className="text-forest/60 mt-2 max-w-xl font-normal">
            Everything you need for a comfortable, secure, and hassle-free coliving experience.
          </p>
        </div>

        {/* Categories Tab Selector */}
        <div className="flex flex-wrap gap-2.5">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-5 py-2 rounded-full text-sm font-normal transition-all duration-300 ${
                activeCategory === category
                  ? "bg-[rgba(20,40,75,0.85)] text-white shadow-lg shadow-forest/10"
                  : "bg-white/60 text-[rgba(20,40,75,0.8)] border border-white/20 hover:bg-white backdrop-blur-md"
              }`}
            >
              {category === "All" ? "All Amenities" : category}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Amenities with Animation */}
      <motion.div 
        layout 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        <AnimatePresence mode="popLayout">
          {filteredAmenities.map((amenity) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              key={amenity.id}
              className="glass-card p-6 flex flex-col h-full hover:shadow-[0_20px_40px_-15px_rgba(224,122,95,0.15)] hover:border-terracotta/30 group transition-all duration-300 cursor-pointer"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-full bg-forest/5 text-forest group-hover:bg-terracotta/10 group-hover:text-terracotta flex items-center justify-center transition-all duration-300">
                  {amenity.icon}
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                  amenity.badge === "Premium" 
                    ? "bg-terracotta/10 text-terracotta" 
                    : amenity.badge === "Essential"
                    ? "bg-forest/10 text-forest"
                    : "bg-black/5 text-black/60"
                }`}>
                  {amenity.badge}
                </span>
              </div>
              <h3 className="font-heading font-bold text-lg text-forest mb-2 group-hover:text-terracotta transition-colors">
                {amenity.name}
              </h3>
              <p className="text-sm text-forest/60 leading-relaxed font-normal flex-1">
                {amenity.description}
              </p>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
