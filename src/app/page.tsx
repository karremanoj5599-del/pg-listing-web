"use client";

import { motion, useScroll, useMotionValueEvent, useTransform, useMotionValue, useSpring, Variants } from "framer-motion";
import { Search, MapPin, Star, ShieldCheck, ArrowRight, BedDouble, Wifi, Utensils, Droplets } from "lucide-react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import PropertyCard from "@/components/PropertyCard";

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
    amenities: [<Wifi key="1" size={16}/>, <Utensils key="2" size={16}/>, <Droplets key="3" size={16}/>]
  }
];

export default function Home() {
  const containerRef = useRef(null);
  const { scrollY, scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const [isScrolled, setIsScrolled] = useState(false);
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/public/properties")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const formatted = data.map(p => ({
            id: p.id,
            name: p.name,
            type: p.type || "Co-ed",
            price: p.pricing && p.pricing.length > 0 ? `₹${p.pricing[0].price}/mo` : "Contact for price",
            rating: 4.5,
            location: p.address || "Hyderabad",
            image: p.primary_image || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80",
            amenities: [<Wifi key="1" size={16}/>, <Utensils key="2" size={16}/>, <BedDouble key="3" size={16}/>]
          }));
          setProperties(formatted);
        } else {
          setProperties(fallbackProperties);
        }
      })
      .catch(() => setProperties(fallbackProperties))
      .finally(() => setLoading(false));
  }, []);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  // Parallax Values
  const y1 = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const scaleHero = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);
  const opacityHero = useTransform(scrollYProgress, [0, 0.5], [1, 0.5]);

  // Magnetic Button Logic
  const magneticX = useMotionValue(0);
  const magneticY = useMotionValue(0);
  const magneticXSpring = useSpring(magneticX, { stiffness: 150, damping: 15, mass: 0.1 });
  const magneticYSpring = useSpring(magneticY, { stiffness: 150, damping: 15, mass: 0.1 });

  const handleMagneticMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.2; // Pull strength
    const y = (e.clientY - rect.top - rect.height / 2) * 0.2;
    magneticX.set(x);
    magneticY.set(y);
  };

  const handleMagneticLeave = () => {
    magneticX.set(0);
    magneticY.set(0);
  };

  // Staggered Text Animations
  const textContainer: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const textItem: Variants = {
    hidden: { opacity: 0, y: 50, rotateX: -90 },
    show: { 
      opacity: 1, 
      y: 0, 
      rotateX: 0,
      transition: { type: "spring", stiffness: 100, damping: 20 }
    }
  };

  return (
    <main ref={containerRef} className="min-h-screen relative overflow-hidden">
      {/* Parallax Abstract Background Elements */}
      <motion.div style={{ y: y1 }} className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-terracotta/10 rounded-full blur-[100px] pointer-events-none" />
      <motion.div style={{ y: y2 }} className="absolute top-[30%] right-[-10%] w-[600px] h-[600px] bg-forest/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Navigation */}
      <motion.nav 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, type: "spring", stiffness: 100, damping: 20 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 flex justify-between items-center ${
          isScrolled 
            ? "mx-4 mt-4 px-6 py-3 glass-card shadow-[0_10px_30px_rgba(0,0,0,0.05)]" 
            : "mx-6 mt-6 px-6 py-4 bg-transparent shadow-none"
        }`}
      >
        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="w-8 h-8 rounded-lg bg-terracotta flex items-center justify-center text-white font-bold group-hover:rotate-12 transition-transform duration-300">
            P
          </div>
          <span className="font-heading font-bold text-xl text-forest tracking-tight">PGMS</span>
        </div>
        <div className="hidden md:flex gap-8 text-sm font-medium text-forest/70">
          <a href="#" className="hover:text-terracotta transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-terracotta after:transition-all hover:after:w-full">Find a PG</a>
          <a href="#" className="hover:text-terracotta transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-terracotta after:transition-all hover:after:w-full">List your property</a>
          <a href="#" className="hover:text-terracotta transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-terracotta after:transition-all hover:after:w-full">About Us</a>
        </div>
        
        <a href="http://localhost:5173/login" target="_blank" rel="noopener noreferrer">
          <motion.button 
            onMouseMove={handleMagneticMove}
            onMouseLeave={handleMagneticLeave}
            style={{ x: magneticXSpring, y: magneticYSpring }}
            className="bg-forest text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-forest/90 transition-colors shadow-lg shadow-forest/20 flex items-center gap-2 group overflow-hidden relative"
          >
            <span className="absolute inset-0 bg-terracotta translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300 ease-out z-0"></span>
            <span className="relative z-10 group-hover:text-white transition-colors duration-300">Sign In</span>
          </motion.button>
        </a>
      </motion.nav>

      {/* Hero Section */}
      <section className="pt-48 pb-20 px-6 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 relative z-10">
        <motion.div 
          variants={textContainer}
          initial="hidden"
          animate="show"
          style={{ scale: scaleHero, opacity: opacityHero }}
          className="flex-1 space-y-8"
        >
          <motion.div variants={textItem} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-terracotta/10 text-terracotta text-sm font-medium border border-terracotta/20">
            <Star size={16} className="fill-terracotta" /> #1 Premium PG Platform
          </motion.div>
          
          <h1 className="text-5xl md:text-7xl font-heading font-bold text-forest leading-[1.1] tracking-tight [perspective:1000px]">
            <motion.div variants={textItem} className="origin-top">Find your perfect</motion.div>
            <motion.div variants={textItem} className="origin-top">
              <span className="text-terracotta relative inline-block">
                home away
                <svg className="absolute w-full h-3 -bottom-1 left-0 text-terracotta/30" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <motion.path 
                    initial={{ pathLength: 0 }} 
                    animate={{ pathLength: 1 }} 
                    transition={{ duration: 1.5, delay: 0.8, ease: "easeInOut" }}
                    d="M0 5 Q 50 10 100 5" 
                    stroke="currentColor" 
                    strokeWidth="4" 
                    fill="transparent" 
                  />
                </svg>
              </span>
            </motion.div>
            <motion.div variants={textItem} className="origin-top">from home.</motion.div>
          </h1>
          
          <motion.p variants={textItem} className="text-lg text-forest/70 max-w-lg leading-relaxed">
            Discover verified, premium paying guest accommodations with top-tier amenities, smart security, and delicious food.
          </motion.p>

          {/* Search Bar */}
          <motion.div variants={textItem} className="glass-card p-2 flex flex-col md:flex-row gap-2 max-w-2xl transform-gpu transition-transform hover:scale-[1.02]">
            <div className="flex-1 flex items-center px-4 py-3 bg-white/50 rounded-xl">
              <MapPin className="text-terracotta mr-3" size={20} />
              <input 
                type="text" 
                placeholder="Search by city, locality or landmark..." 
                className="bg-transparent border-none outline-none w-full text-forest placeholder:text-forest/50 font-medium"
              />
            </div>
            <button className="bg-terracotta text-white px-8 py-4 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-[#c96348] transition-colors hover:shadow-lg hover:shadow-terracotta/30 group">
              <Search size={18} className="group-hover:scale-110 transition-transform" /> Search
            </button>
          </motion.div>
        </motion.div>

        {/* 3D Concept Area */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8, rotateY: 15 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          transition={{ duration: 1.2, type: "spring", bounce: 0.4, delay: 0.3 }}
          style={{ y: useTransform(scrollYProgress, [0, 1], [0, 150]) }}
          className="flex-1 relative w-full aspect-square max-w-md lg:max-w-full perspective-1000"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-cream to-white rounded-[40px] shadow-2xl border border-white/50 overflow-hidden flex items-center justify-center transform-style-3d">
            <motion.div
              className="absolute inset-0 bg-terracotta z-10"
              initial={{ scaleY: 1 }}
              animate={{ scaleY: 0 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.6 }}
              style={{ originY: 0 }}
            />
            <motion.img 
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.5, delay: 0.5 }}
              src="https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80" 
              alt="Premium Room" 
              className="w-full h-full object-cover opacity-90 mix-blend-multiply"
            />
            
            {/* Floating UI Element with Physics */}
            <motion.div 
              animate={{ y: [0, -15, 0], rotate: [0, -2, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
              className="absolute -left-8 top-20 glass-card p-4 flex items-center gap-4 hover:scale-105 cursor-pointer transition-transform"
            >
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                <ShieldCheck size={24} />
              </div>
              <div>
                <p className="text-sm font-bold text-forest">100% Verified</p>
                <p className="text-xs text-forest/60">Secure properties</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Featured Properties */}
      <section className="py-24 px-6 max-w-7xl mx-auto relative z-10">
        <div className="flex justify-between items-end mb-12">
          <div>
            <motion.h2 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 100 }}
              className="text-4xl font-heading font-bold text-forest mb-4"
            >
              Trending Properties
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-forest/60 text-lg"
            >
              Explore the most sought-after accommodations this week.
            </motion.p>
          </div>
          <motion.button 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="hidden md:flex items-center gap-2 text-terracotta font-medium hover:gap-4 transition-all group"
          >
            View all <ArrowRight size={18} className="group-hover:text-terracotta" />
          </motion.button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            <div className="col-span-full text-center text-forest/50 py-12">Loading properties...</div>
          ) : properties.map((property, i) => (
            <PropertyCard key={property.id} property={property} index={i} />
          ))}
        </div>
      </section>
    </main>
  );
}
