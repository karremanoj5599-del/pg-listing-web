"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { 
  Search, 
  ArrowLeft, 
  Filter, 
  SlidersHorizontal, 
  Wifi, 
  Utensils, 
  BedDouble, 
  Droplets, 
  Sparkles,
  MapPin,
  CheckCircle2,
  X
} from "lucide-react";
import PropertyCard from "@/components/PropertyCard";

const fallbackProperties = [
  {
    id: 1,
    name: "Srikara Premium Co-ed",
    type: "Co-ed",
    price: "₹8,500/mo",
    rating: 4.8,
    location: "Hitech City, Hyderabad",
    googleMapUrl: "https://maps.app.goo.gl/Tfj9Rfzx4e89GSXp7",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80",
    amenities: [<Wifi key="1" size={16} />, <Utensils key="2" size={16} />, <Droplets key="3" size={16} />],
    rawPricing: [
      { sharing_type: "2 Sharing", price: 8500 },
      { sharing_type: "3 Sharing", price: 7000 }
    ],
    numericMinPrice: 7000
  },
  {
    id: 2,
    name: "Elite Mens Luxury PG",
    type: "Mens",
    price: "₹12,000/mo",
    rating: 4.9,
    location: "Madhapur, Hyderabad",
    googleMapUrl: "https://maps.app.goo.gl/Tfj9Rfzx4e89GSXp7",
    image: "https://images.unsplash.com/photo-1502672260266-1c1e8741a804?auto=format&fit=crop&w=600&q=80",
    amenities: [<Wifi key="1" size={16} />, <Utensils key="2" size={16} />, <BedDouble key="3" size={16} />],
    rawPricing: [
      { sharing_type: "Single Sharing", price: 15000 },
      { sharing_type: "2 Sharing", price: 12000 }
    ],
    numericMinPrice: 12000
  },
  {
    id: 3,
    name: "Aditya Womens Coliving",
    type: "Womens",
    price: "₹9,500/mo",
    rating: 4.7,
    location: "Gachibowli, Hyderabad",
    googleMapUrl: null,
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80",
    amenities: [<Wifi key="1" size={16} />, <Utensils key="2" size={16} />, <Droplets key="3" size={16} />],
    rawPricing: [
      { sharing_type: "2 Sharing", price: 9500 },
      { sharing_type: "3 Sharing", price: 8000 }
    ],
    numericMinPrice: 8000
  }
];

function PropertiesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialQuery = searchParams.get("query") || "";
  const initialGender = searchParams.get("gender") || "All";
  const initialSharing = searchParams.get("sharing") || "All";
  const initialMaxPrice = parseInt(searchParams.get("maxPrice") || "25000", 10);

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedGender, setSelectedGender] = useState(initialGender);
  const [selectedSharing, setSelectedSharing] = useState(initialSharing);
  const [maxPrice, setMaxPrice] = useState(initialMaxPrice);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";
        const res = await fetch(`${baseUrl}/public/properties`);
        if (!res.ok) {
          setProperties(fallbackProperties);
          return;
        }
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const formatted = data.map((p: any) => {
            const rawPricing = p.pricing || [];
            const prices = rawPricing.map((pr: any) => pr.price).filter((pr: any) => typeof pr === "number");
            const minPrice = prices.length > 0 ? Math.min(...prices) : 8000;

            return {
              id: p.id,
              name: p.name,
              type: p.type || "Co-ed",
              price: rawPricing.length > 0 ? `₹${rawPricing[0].price}/mo` : "Contact for price",
              rating: 4.8,
              location: p.address || "Hyderabad",
              googleMapUrl: p.google_map_url || null,
              image: p.primary_image || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80",
              amenities: [<Wifi key="1" size={16} />, <Utensils key="2" size={16} />, <BedDouble key="3" size={16} />],
              amenityNames: p.amenities?.map((a: any) => a.amenity_name) || ["Wi-Fi", "Food", "Housekeeping"],
              rawPricing,
              numericMinPrice: minPrice
            };
          });
          setProperties(formatted);
        } else {
          setProperties(fallbackProperties);
        }
      } catch (err) {
        console.error("Error fetching properties:", err);
        setProperties(fallbackProperties);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  // Update query params in URL when filters change
  const applyFilters = () => {
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set("query", searchQuery.trim());
    if (selectedGender !== "All") params.set("gender", selectedGender);
    if (selectedSharing !== "All") params.set("sharing", selectedSharing);
    if (maxPrice < 25000) params.set("maxPrice", maxPrice.toString());

    router.replace(`/properties?${params.toString()}`, { scroll: false });
  };

  const filteredProperties = useMemo(() => {
    return properties.filter((p) => {
      // 1. Gender filter
      if (selectedGender === "Men" && p.type !== "Mens") return false;
      if (selectedGender === "Women" && p.type !== "Womens") return false;
      if (selectedGender === "Co-living" && p.type !== "Co-ed") return false;

      // 2. Max Price filter
      if (p.numericMinPrice && p.numericMinPrice > maxPrice) return false;

      // 3. Sharing type filter
      if (selectedSharing !== "All") {
        const matchesSharing = p.rawPricing?.some((pr: any) => {
          const type = (pr.sharing_type || "").toLowerCase();
          if (selectedSharing === "Single") return type.includes("single") || type.includes("1");
          if (selectedSharing === "2 Sharing") return type.includes("2") || type.includes("double");
          if (selectedSharing === "3 Sharing") return type.includes("3") || type.includes("triple");
          if (selectedSharing === "4 Sharing") return type.includes("4");
          return true;
        });
        if (!matchesSharing) return false;
      }

      // 4. Amenities filter
      if (selectedAmenities.length > 0) {
        const pAmenities = (p.amenityNames || []).map((a: string) => a.toLowerCase());
        const hasAll = selectedAmenities.every((req) => 
          pAmenities.some((pa: string) => pa.includes(req.toLowerCase()))
        );
        if (!hasAll) return false;
      }

      // 5. Text search query filter
      if (searchQuery.trim().length > 0) {
        const queryClean = searchQuery.toLowerCase().trim();
        const words = queryClean.split(/\s+/).filter(Boolean);
        const nameLower = (p.name || "").toLowerCase();
        const locLower = (p.location || "").toLowerCase();

        return words.every((w) => nameLower.includes(w) || locLower.includes(w));
      }

      return true;
    });
  }, [properties, selectedGender, selectedSharing, maxPrice, selectedAmenities, searchQuery]);

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) => 
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    );
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedGender("All");
    setSelectedSharing("All");
    setMaxPrice(25000);
    setSelectedAmenities([]);
    router.replace("/properties", { scroll: false });
  };

  return (
    <main className="min-h-screen bg-[#f8f9fa] pb-24">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link 
              href="/"
              className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-700"
              title="Back to Home"
            >
              <ArrowLeft size={20} />
            </Link>
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#b84a39] flex items-center justify-center text-white font-bold text-sm">
                P
              </div>
              <span className="font-heading font-bold text-xl text-[#14284b] tracking-tight">
                PGMS Spaces
              </span>
            </Link>
          </div>

          {/* Search bar */}
          <div className="flex-1 max-w-md relative hidden sm:block">
            <input
              type="text"
              placeholder="Search by area, landmark or PG name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") applyFilters();
              }}
              className="w-full bg-gray-100 border border-gray-200 rounded-full py-2.5 pl-10 pr-4 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#b84a39]/20 focus:border-[#b84a39] transition-all"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>

          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="md:hidden flex items-center gap-1.5 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm font-medium text-gray-700 transition-colors"
          >
            <Filter size={16} /> Filters
          </button>
        </div>
      </header>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 flex flex-col md:flex-row gap-8">
        {/* Desktop Sidebar Filters */}
        <aside className={`md:w-72 md:block ${isFilterOpen ? "block" : "hidden"} bg-white p-6 rounded-2xl border border-gray-200 shadow-sm h-fit sticky top-24`}>
          <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
            <div className="flex items-center gap-2 font-bold text-gray-900 text-base">
              <SlidersHorizontal size={18} className="text-[#b84a39]" /> Filter Spaces
            </div>
            <button 
              onClick={resetFilters}
              className="text-xs text-[#b84a39] hover:underline font-semibold"
            >
              Reset All
            </button>
          </div>

          <div className="space-y-6">
            {/* Gender Category */}
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2.5">
                Resident Gender
              </label>
              <div className="grid grid-cols-2 gap-2">
                {["All", "Men", "Women", "Co-living"].map((type) => (
                  <button
                    key={type}
                    onClick={() => {
                      setSelectedGender(type);
                    }}
                    className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      selectedGender === type
                        ? "bg-[#14284b] text-white shadow-sm"
                        : "bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-100"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Sharing Type */}
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2.5">
                Occupancy / Sharing
              </label>
              <div className="flex flex-col gap-1.5">
                {["All", "Single", "2 Sharing", "3 Sharing", "4 Sharing"].map((sharing) => (
                  <label key={sharing} className="flex items-center gap-2.5 text-sm text-gray-700 cursor-pointer">
                    <input
                      type="radio"
                      name="sharing_radio"
                      checked={selectedSharing === sharing}
                      onChange={() => setSelectedSharing(sharing)}
                      className="accent-[#b84a39]"
                    />
                    <span>{sharing}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Max Budget Slider */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Max Budget
                </label>
                <span className="text-sm font-bold text-[#b84a39]">₹{maxPrice.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="5000"
                max="25000"
                step="500"
                value={maxPrice}
                onChange={(e) => setMaxPrice(parseInt(e.target.value, 10))}
                className="w-full accent-[#b84a39] cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-gray-400 mt-1">
                <span>₹5,000</span>
                <span>₹25,000+</span>
              </div>
            </div>

            {/* Amenities Checklist */}
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2.5">
                Must-Have Amenities
              </label>
              <div className="space-y-2">
                {["Wi-Fi", "Food", "AC", "Security", "Housekeeping", "Power Backup"].map((amenity) => (
                  <label key={amenity} className="flex items-center gap-2.5 text-sm text-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedAmenities.includes(amenity)}
                      onChange={() => toggleAmenity(amenity)}
                      className="rounded accent-[#b84a39]"
                    />
                    <span>{amenity}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              onClick={applyFilters}
              className="w-full bg-[#b84a39] hover:bg-[#a03d2e] text-white py-3 rounded-xl font-bold text-sm shadow-md transition-colors"
            >
              Apply Filter
            </button>
          </div>
        </aside>

        {/* Properties Results Stream */}
        <section className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-heading font-bold text-gray-900">
                Verified Coliving Properties
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">
                Showing {filteredProperties.length} available PG spaces with biometric access & instant booking
              </p>
            </div>
          </div>

          {loading ? (
            <div className="p-16 text-center text-gray-400 bg-white rounded-3xl border border-gray-200">
              Loading verified properties...
            </div>
          ) : filteredProperties.length === 0 ? (
            <div className="p-16 text-center bg-white rounded-3xl border border-gray-200">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                <Search size={28} />
              </div>
              <h3 className="font-bold text-gray-800 text-lg mb-1">No spaces found</h3>
              <p className="text-sm text-gray-500 max-w-sm mx-auto mb-6">
                Try loosening your budget, changing sharing preference, or clearing filters.
              </p>
              <button
                onClick={resetFilters}
                className="px-6 py-2.5 bg-[#b84a39] text-white rounded-full text-sm font-semibold hover:bg-[#a03d2e] transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProperties.map((property, idx) => (
                <PropertyCard key={property.id} property={property} index={idx} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default function PropertiesPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-gray-400">Loading PG spaces...</div>}>
      <PropertiesContent />
    </Suspense>
  );
}
