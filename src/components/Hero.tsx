import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Compass, Sliders, Eye, ShieldCheck } from "lucide-react";
import Navbar from "./Navbar";
import HeroBadge from "./HeroBadge";
import BottomLeftCard from "./BottomLeftCard";
import BottomRightCorner from "./BottomRightCorner";

interface HeroProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function Hero({ searchQuery, setSearchQuery }: HeroProps) {
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [activeRoom, setActiveRoom] = useState<"bedroom" | "kitchen" | "lounge">("bedroom");
  const [fov, setFov] = useState(75);
  const [simulatedDistance, setSimulatedDistance] = useState(2.3);
  const [compassAngle, setCompassAngle] = useState(142);

  // Smooth scroll handler
  const handleScrollToRooms = () => {
    const el = document.getElementById("ready-to-book");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  // Simulated 3D Telemetry (Rotates compass & drifts distance slightly in real time)
  useEffect(() => {
    if (!isTourOpen) return;
    const interval = setInterval(() => {
      setCompassAngle(prev => (prev + Math.floor(Math.random() * 3) - 1 + 360) % 360);
      setSimulatedDistance(prev => {
        const drift = Math.random() * 0.1 - 0.05;
        const next = prev + drift;
        return parseFloat(Math.min(Math.max(next, 1.2), 3.8).toFixed(2));
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isTourOpen]);

  // Room Image mapping for 3D simulation
  const roomImages = {
    bedroom: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1600&q=80",
    kitchen: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1600&q=80",
    lounge: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=80"
  };

  // Map FOV to CSS scale factor
  const calculateScale = () => {
    // 45 deg FOV = zoomed in (1.35x), 110 deg FOV = zoomed out (0.95x)
    return 1.35 - ((fov - 45) / (110 - 45)) * 0.4;
  };

  return (
    <div className="w-full h-screen flex items-center justify-center p-3 md:p-5 bg-[#f3f3f3]">
      <section className="relative w-full max-w-[1536px] h-full rounded-[1.5rem] md:rounded-[3rem] overflow-hidden shadow-none flex flex-col items-center bg-white/10 group">
        {/* 3D Room Background */}
        <img
          src="/hero-3d.png"
          alt="NEST 3D Premium Co-Living Room"
          className="absolute inset-0 w-full h-full object-cover object-[65%] lg:object-center z-0"
        />

        {/* Subtle dark gradient overlay to ensure text contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/25 to-black/50 z-0 pointer-events-none" />

        {/* Content Layer */}
        <div className="relative z-10 w-full h-full flex flex-col items-center">
          <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          
          <div className="w-full flex flex-col items-center pt-12 px-6 text-center max-w-4xl">
            <HeroBadge onClick={handleScrollToRooms} />
            
            <motion.h1
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-[80px] font-normal text-white mb-2 tracking-tight leading-[1.05] drop-shadow-md"
            >
              Elevated Co-Living.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-sm sm:text-base md:text-lg text-white/90 leading-relaxed max-w-xl font-normal drop-shadow"
            >
              Discover premium spaces, schedule instant walk-throughs, and secure curated rooms tailored for modern professionals.
            </motion.p>
          </div>

          <BottomLeftCard onExplore={handleScrollToRooms} />
          <BottomRightCorner onLaunchTour={() => setIsTourOpen(true)} />
        </div>
      </section>

      {/* Simulated 3D Virtual Tour Overlay Modal */}
      <AnimatePresence>
        {isTourOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ type: "spring", damping: 25, stiffness: 180 }}
              className="relative w-full max-w-5xl h-[85vh] md:h-[80vh] bg-[#2A433A]/95 border border-white/10 rounded-[2rem] overflow-hidden flex flex-col shadow-2xl"
            >
              {/* Simulated 3D Viewport View area */}
              <div className="relative flex-1 bg-black overflow-hidden select-none">
                {/* 3D Panorama Image with slow auto-panning cinematic drift */}
                <motion.img
                  key={activeRoom}
                  src={roomImages[activeRoom]}
                  alt={`Simulated 3D view of ${activeRoom}`}
                  animate={{
                    x: ["-4%", "4%", "-4%"],
                    y: ["-2%", "2%", "-2%"],
                  }}
                  style={{ scale: calculateScale(), transformOrigin: "center center" }}
                  transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute inset-0 w-[112%] h-[112%] object-cover pointer-events-none max-w-none origin-center"
                />

                {/* HUD Scanlines & Vignette Grid */}
                <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(0,0,0,0)_50%,rgba(0,0,0,0.65)_100%)] z-10" />
                <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.2)_50%)] bg-[size:100%_4px] opacity-30 z-10" />
                
                {/* HUD Crosshair */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                  <div className="relative w-12 h-12 border border-white/20 rounded-full flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-terracotta rounded-full animate-ping" />
                    <span className="absolute text-[8px] text-white/50 -bottom-5 uppercase tracking-widest font-mono">Center Focus</span>
                  </div>
                </div>

                {/* Simulated Telemetry HUD HUD overlays */}
                {/* Top Center Tabs */}
                <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 flex gap-2.5 bg-black/40 backdrop-blur-md p-1.5 border border-white/10 rounded-full">
                  {(["bedroom", "kitchen", "lounge"] as const).map((room) => (
                    <button
                      key={room}
                      onClick={() => setActiveRoom(room)}
                      className={`px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
                        activeRoom === room
                          ? "bg-terracotta text-white shadow-md shadow-terracotta/20"
                          : "text-white/60 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      {room === "bedroom" ? "Premium Loft Suite" : room === "kitchen" ? "Shared Kitchen" : "Executive Lounge"}
                    </button>
                  ))}
                </div>

                {/* Close Button top-right */}
                <button
                  onClick={() => setIsTourOpen(false)}
                  className="absolute top-6 right-6 z-20 w-11 h-11 bg-black/40 backdrop-blur-md border border-white/10 hover:border-white/30 text-white rounded-full flex items-center justify-center transition-colors shadow-lg hover:bg-white/5 cursor-pointer"
                >
                  <X size={20} />
                </button>

                {/* Left Telemetry Box */}
                <div className="absolute bottom-6 left-6 z-20 bg-black/40 backdrop-blur-md border border-white/10 p-4 rounded-xl font-mono text-[10px] text-white/80 space-y-1.5 min-w-[160px]">
                  <div className="flex items-center gap-1.5 text-terracotta font-bold text-xs uppercase mb-1 tracking-wider">
                    <Eye size={12} /> Live 3D Scanner
                  </div>
                  <div>FEED: ACTIVE</div>
                  <div className="flex items-center gap-1">
                    <Compass size={11} className="text-white/50" /> COMPASS: {compassAngle}° NW
                  </div>
                  <div>RANGE: {simulatedDistance}m</div>
                  <div>RESOLUTION: 4K HDR</div>
                </div>

                {/* Right FOV Slider HUD */}
                <div className="absolute bottom-6 right-6 z-20 bg-black/40 backdrop-blur-md border border-white/10 p-4 rounded-xl font-mono text-[10px] text-white/80 space-y-2 min-w-[180px]">
                  <div className="flex items-center gap-1.5 text-terracotta font-bold text-xs uppercase tracking-wider">
                    <Sliders size={12} /> Lens Controls
                  </div>
                  <div className="flex justify-between items-center text-white/70">
                    <span>FIELD OF VIEW</span>
                    <span className="font-bold text-white">{fov}°</span>
                  </div>
                  <input
                    type="range"
                    min="45"
                    max="110"
                    value={fov}
                    onChange={(e) => setFov(Number(e.target.value))}
                    className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-terracotta"
                  />
                  <div className="flex justify-between text-[8px] text-white/40">
                    <span>ZOOM IN (45°)</span>
                    <span>ZOOM OUT (110°)</span>
                  </div>
                </div>

                {/* Verified Space Indicator top-left */}
                <div className="absolute top-6 left-6 z-20 flex items-center gap-2 bg-forest/80 backdrop-blur-md border border-white/10 px-4 py-2.5 rounded-full font-sans text-xs font-semibold text-white tracking-wide shadow-md">
                  <ShieldCheck size={16} className="text-terracotta animate-pulse" /> Verified Property Scan
                </div>
              </div>

              {/* Bottom description bar */}
              <div className="p-6 md:px-8 md:py-6 bg-[#2A433A] flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left border-t border-white/5">
                <div>
                  <h4 className="text-lg font-bold text-white font-heading">
                    {activeRoom === "bedroom" 
                      ? "Premium Single Occupancy Suite" 
                      : activeRoom === "kitchen" 
                      ? "Modern Pantry & Shared Kitchen Area" 
                      : "Executive Recreational Lounge Spaces"}
                  </h4>
                  <p className="text-sm text-white/70 mt-1 max-w-xl font-normal">
                    {activeRoom === "bedroom"
                      ? "Experience fully furnished rooms equipped with premium bedding, modular study desks, and full air conditioning."
                      : activeRoom === "kitchen"
                      ? "Cook your own meals or enjoy fresh food services in our clean, spacious kitchen featuring high-end modular fixtures."
                      : "Relax and socialize in common spaces outfitted with entertainment systems, couches, and indoor board games."}
                  </p>
                </div>
                <button
                  onClick={handleScrollToRooms}
                  className="bg-terracotta text-white font-semibold text-sm px-6 py-3 rounded-full hover:bg-[#d06b50] transition-colors shadow-md shadow-terracotta/20 flex items-center gap-2 shrink-0 cursor-pointer"
                >
                  Book this Space &rarr;
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
