"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Building2, 
  Users, 
  TrendingUp, 
  ShieldAlert, 
  ArrowRight 
} from "lucide-react";
import Link from "next/link";

export default function OwnerSection() {
  const benefits = [
    {
      icon: <TrendingUp className="w-6 h-6 text-terracotta" />,
      title: "Maximize Occupancy",
      description: "Get listed in front of thousands of active seekers in Hyderabad's tech hubs and fill vacancies in days."
    },
    {
      icon: <Building2 className="w-6 h-6 text-terracotta" />,
      title: "Smart Room Management",
      description: "Easily allocate single, double, or triple sharing beds and track live occupancy stats."
    },
    {
      icon: <Users className="w-6 h-6 text-terracotta" />,
      title: "Lead & Visit Tracking",
      description: "Receive instant visit schedule requests and booking queries from prospective tenants."
    },
    {
      icon: <ShieldAlert className="w-6 h-6 text-terracotta" />,
      title: "Verified Rent Payers",
      description: "Secure reliable tenants with verified profile details and integrated background checks."
    }
  ];

  return (
    <section id="owners-info" className="py-24 px-6 md:px-12 bg-[#2A433A] text-white rounded-[1.5rem] md:rounded-[3rem] max-w-[1440px] mx-auto my-12 overflow-hidden relative">
      {/* Background decoration */}
      <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-white/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-terracotta/10 rounded-full blur-[80px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10 flex flex-col lg:flex-row items-center gap-16">
        {/* Left text column */}
        <div className="flex-1 space-y-6">
          <span className="text-xs uppercase tracking-widest text-white/60 font-bold block">
            For Property Owners
          </span>
          <h2 className="text-3xl md:text-5xl font-normal tracking-tight leading-tight">
            Host Your PG on <span className="text-terracotta font-semibold">PGMS</span> & Simplify Management
          </h2>
          <p className="text-white/80 leading-relaxed text-lg max-w-lg">
            Stop juggling spreadsheets and phone calls. List your properties, coordinate visits, track room pricing, and manage leads automatically in our unified platform.
          </p>

          <div className="pt-4 flex flex-wrap gap-4">
            <Link href="/login?register=true">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="bg-terracotta text-white font-semibold px-8 py-4 rounded-full flex items-center gap-3 shadow-lg shadow-terracotta/20 hover:bg-[#d06b50] transition-colors"
              >
                Register Property <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
          </div>
        </div>

        {/* Right benefits grid */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
          {benefits.map((benefit, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="bg-white/5 border border-white/10 backdrop-blur-md p-6 rounded-2xl flex flex-col gap-4 hover:bg-white/10 transition-colors duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                {benefit.icon}
              </div>
              <div>
                <h3 className="font-semibold text-lg text-white mb-2">{benefit.title}</h3>
                <p className="text-sm text-white/70 leading-relaxed font-normal">{benefit.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
