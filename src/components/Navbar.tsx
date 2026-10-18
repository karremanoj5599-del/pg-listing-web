"use client";

import { motion } from "motion/react";
import { ArrowUpRight, Search, User, Smartphone, X, Sparkles, Building2 } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

interface NavbarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function Navbar({ searchQuery, setSearchQuery }: NavbarProps) {
  const [hasToken, setHasToken] = useState(false);
  const [showResidentBanner, setShowResidentBanner] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    setHasToken(!!token);
  }, []);

  const menuItems = [
    { name: "Explore PGs", href: "/properties" },
    { name: "Locations", target: "ready-to-book" },
    { name: "Amenities", target: "amenities" },
    { name: "Self-Register", href: "/self-register" },
    { name: "For Owners", target: "owners-info" },
  ];

  const handleScrollOrNav = (target?: string, href?: string) => {
    if (href) {
      window.location.href = href;
      return;
    }
    if (target) {
      const element = document.getElementById(target);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <header className="w-full relative z-30">
      {/* Smart Mobile & Resident Banner */}
      {showResidentBanner && (
        <div className="w-full bg-[#1A3326]/90 backdrop-blur-md text-white/90 text-xs py-2 px-4 border-b border-white/10 flex items-center justify-between transition-all">
          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 mx-auto text-center">
            <span className="flex items-center gap-1.5 text-white/80">
              <Smartphone size={13} className="text-terracotta" />
              <span>Are you a resident?</span>
            </span>
            <a 
              href="https://play.google.com/store" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="font-bold text-terracotta hover:text-white underline transition-colors"
            >
              Open Tenant App
            </a>
            <span className="hidden sm:inline text-white/30">•</span>
            <span className="text-white/80 hidden sm:inline">Moving in today?</span>
            <Link 
              href="/self-register" 
              className="font-bold text-white hover:text-terracotta underline transition-colors"
            >
              Complete Fast Self-Registration
            </Link>
          </div>
          <button 
            onClick={() => setShowResidentBanner(false)}
            className="text-white/50 hover:text-white p-1 rounded-full shrink-0"
            aria-label="Dismiss banner"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Main Navigation Bar */}
      <nav className="flex items-center justify-between py-5 px-6 md:px-10 w-full relative z-10">
        {/* Left Side: Desktop Logo & Branding */}
        <Link 
          href="/"
          className="flex-1 hidden md:flex items-center gap-2 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-lg bg-terracotta flex items-center justify-center text-white font-bold shadow-md shadow-terracotta/25 group-hover:scale-105 transition-transform">
            P
          </div>
          <span className="font-heading font-bold text-xl text-white tracking-tight">
            PGMS
          </span>
        </Link>

        {/* Center Menu */}
        <ul className="hidden md:flex items-center gap-7 text-white/85 font-medium text-sm">
          {menuItems.map((item) => (
            <li
              key={item.name}
              onClick={() => handleScrollOrNav(item.target, item.href)}
              className="cursor-pointer hover:text-white transition-colors flex items-center gap-1 hover:translate-y-[-1px] duration-150"
            >
              {item.name}
            </li>
          ))}
        </ul>

        {/* Mobile Logo & Branding */}
        <Link 
          href="/"
          className="md:hidden flex items-center gap-2 cursor-pointer"
        >
          <div className="w-7 h-7 rounded-lg bg-terracotta flex items-center justify-center text-white font-bold text-sm shadow-md shadow-terracotta/25">
            P
          </div>
          <span className="font-heading font-bold text-lg text-white tracking-tight">
            PGMS
          </span>
        </Link>

        {/* Right Section: Search & Book Button */}
        <div className="flex-1 flex justify-end items-center gap-3">
          <div className="relative hidden sm:block">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  window.location.href = `/properties?query=${encodeURIComponent(searchQuery)}`;
                }
              }}
              placeholder="Search PG locations..."
              className="pl-9 pr-4 py-2 rounded-full text-xs font-normal border border-white/20 bg-white/15 backdrop-blur-md text-white placeholder-white/60 focus:outline-none focus:bg-white/25 w-36 md:w-44 focus:w-48 lg:focus:w-56 transition-all duration-300 shadow-sm"
            />
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-white/70" />
          </div>

          <Link 
            href="/properties" 
            className="hidden lg:flex items-center gap-1 text-white/80 hover:text-white transition-colors text-xs font-semibold mr-1"
          >
            <Building2 size={14} />
            Browse All
          </Link>

          {hasToken ? (
            <Link href="/requests" className="hidden sm:flex items-center gap-1.5 text-white/90 hover:text-white transition-colors text-xs md:text-sm font-medium mr-2">
              <User size={16} />
              Requests
            </Link>
          ) : (
            <Link href="/login" className="hidden sm:block text-white/80 hover:text-white transition-colors text-xs md:text-sm font-medium mr-2">
              Owner Login
            </Link>
          )}

          <Link href="/properties">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center bg-terracotta text-white rounded-full pl-2 pr-4 md:pr-6 py-1.5 md:py-2 gap-2 md:gap-3 hover:bg-[#d06b50] transition-colors group shrink-0 shadow-md shadow-terracotta/25"
            >
              <div className="bg-white/20 p-1 md:p-1.5 rounded-full flex items-center justify-center">
                <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5 text-white" />
              </div>
              <span className="text-xs md:text-sm font-bold">Book Online</span>
            </motion.button>
          </Link>
        </div>
      </nav>
    </header>
  );
}
