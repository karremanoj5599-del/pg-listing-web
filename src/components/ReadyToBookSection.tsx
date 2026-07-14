"use client";

import React, { useState, useEffect } from "react";
import { Wifi, Utensils, Droplets, BedDouble } from "lucide-react";
import PropertyCard from "./PropertyCard";

// Mock data fallback if API fails
const fallbackProperties = [
  {
    id: 1,
    name: "Srikara Premium Co-ed",
    type: "Co-ed",
    price: "₹8,500/mo",
    rating: 4.8,
    location: "Hitech City, Hyderabad",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80",
    amenities: [<Wifi key="1" size={16} />, <Utensils key="2" size={16} />, <Droplets key="3" size={16} />],
    rawPricing: [
      { sharing_type: "2 Sharing", price: 8500 },
      { sharing_type: "3 Sharing", price: 7000 }
    ]
  },
  {
    id: 2,
    name: "Elite Mens Luxury PG",
    type: "Mens",
    price: "₹12,000/mo",
    rating: 4.9,
    location: "Madhapur, Hyderabad",
    image: "https://images.unsplash.com/photo-1502672260266-1c1e8741a804?auto=format&fit=crop&w=600&q=80",
    amenities: [<Wifi key="1" size={16} />, <Utensils key="2" size={16} />, <BedDouble key="3" size={16} />],
    rawPricing: [
      { sharing_type: "Single Sharing", price: 15000 },
      { sharing_type: "2 Sharing", price: 12000 }
    ]
  },
  {
    id: 3,
    name: "Aditya Womens Coliving",
    type: "Womens",
    price: "₹9,500/mo",
    rating: 4.7,
    location: "Gachibowli, Hyderabad",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80",
    amenities: [<Wifi key="1" size={16} />, <Utensils key="2" size={16} />, <Droplets key="3" size={16} />],
    rawPricing: [
      { sharing_type: "2 Sharing", price: 9500 },
      { sharing_type: "3 Sharing", price: 8000 }
    ]
  }
];

interface ReadyToBookProps {
  searchQuery?: string;
}

export default function ReadyToBookSection({ searchQuery = "" }: ReadyToBookProps) {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("All");

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/public/properties");
        if (!res.ok) {
          console.warn("API returned non-ok status, falling back to mock data.");
          setProperties(fallbackProperties);
          return;
        }
        const data = await res.json();

        if (Array.isArray(data) && data.length > 0) {
          const formatted = data.map(p => ({
            id: p.id,
            name: p.name,
            type: p.type || "Co-ed",
            price: p.pricing && p.pricing.length > 0 ? `₹${p.pricing[0].price}/mo` : "Contact for price",
            rating: 4.8,
            location: p.address || "Hyderabad",
            image: p.primary_image || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80",
            amenities: [<Wifi key="1" size={16} />, <Utensils key="2" size={16} />, <BedDouble key="3" size={16} />],
            rawPricing: p.pricing || []
          }));
          setProperties(formatted);
        } else {
          setProperties(fallbackProperties);
        }
      } catch (error) {
        console.error("Failed to fetch properties:", error);
        setProperties(fallbackProperties);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  const filteredProperties = properties.filter(p => {
    // 1. Gender filter
    if (filterType === "MWn" && p.type !== "Mens") return false;
    if (filterType === "Women" && p.type !== "Womens") return false;
    if (filterType === "Co-living" && p.type !== "Co-ed") return false;

    // 2. Search query filter
    if (searchQuery.trim().length > 0) {
      const queryClean = searchQuery.toLowerCase().trim();
      const words = queryClean.split(/\s+/).filter(word => {
        const fillers = ["for", "in", "at", "with", "a", "an", "the", "pg", "coliving", "co-living"];
        return word.length > 0 && !fillers.includes(word);
      });

      if (words.length > 0) {
        // Every word must match at least one attribute of the property
        return words.every(word => {
          if (p.name?.toLowerCase().includes(word)) return true;
          if (p.location?.toLowerCase().includes(word)) return true;
          
          const typeLower = p.type?.toLowerCase() || "";
          if (word === "men" || word === "mens" || word === "male" || word === "boy" || word === "boys") {
            if (typeLower === "mens") return true;
          }
          if (word === "women" || word === "womens" || word === "female" || word === "girl" || word === "girls") {
            if (typeLower === "womens") return true;
          }
          if (word === "co-ed" || word === "coed" || word === "mix" || word === "mixed" || word === "both") {
            if (typeLower === "co-ed") return true;
          }
          if (typeLower.includes(word)) return true;

          const pricingMatches = p.rawPricing?.some((po: any) => {
            const sharingLower = po.sharing_type?.toLowerCase() || "";
            if (word === "double" || word === "2") {
              if (sharingLower.includes("2") || sharingLower.includes("double") || sharingLower.includes("two")) return true;
            }
            if (word === "single" || word === "1") {
              if (sharingLower.includes("single") || sharingLower.includes("1") || sharingLower.includes("one")) return true;
            }
            if (word === "triple" || word === "3") {
              if (sharingLower.includes("3") || sharingLower.includes("triple") || sharingLower.includes("three")) return true;
            }
            return sharingLower.includes(word);
          });
          
          if (pricingMatches) return true;

          return false;
        });
      }
    }

    return true;
  });

  return (
    <section id="ready-to-book" className="py-24 px-6 md:px-12 max-w-[1536px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <span className="text-xs uppercase tracking-widest text-[rgba(20,40,75,0.6)] font-bold mb-2 block">
            Available Spaces
          </span>
          <h2 className="text-3xl md:text-5xl font-normal text-[#3A3F4A] tracking-tight">
            Ready to Book Rooms
          </h2>
          <p className="text-forest/60 mt-2 max-w-xl font-normal">
            Explore verified premium co-living properties and schedule your visit instantly.
          </p>
        </div>

        {/* Dynamic Filters */}
        <div className="flex flex-wrap gap-2.5">
          {["All", "MWn", "Women", "Co-living"].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-5 py-2 rounded-full text-sm font-normal transition-all duration-300 ${
                filterType === type
                  ? "bg-[rgba(20,40,75,0.85)] text-white shadow-lg shadow-forest/10"
                  : "bg-white/60 text-[rgba(20,40,75,0.8)] border border-white/20 hover:bg-white backdrop-blur-md"
              }`}
            >
              {type === "MWn" ? "Men" : type === "Co-living" ? "Co-living" : type}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of properties */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          <div className="col-span-full text-center text-[rgba(20,40,75,0.6)] py-20 bg-white/30 rounded-3xl border border-white/20 backdrop-blur-md">
            Loading properties...
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="col-span-full text-center text-[rgba(20,40,75,0.6)] py-20 bg-white/30 rounded-3xl border border-white/20 backdrop-blur-md">
            {searchQuery ? "No rooms found matching your search query." : "No rooms found for this category."}
          </div>
        ) : (
          filteredProperties.map((property, idx) => (
            <PropertyCard key={property.id} property={property} index={idx} />
          ))
        )}
      </div>
    </section>
  );
}
