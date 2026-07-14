"use client";

import React, { useState } from "react";
import Hero from "@/components/Hero";
import AmenitiesSection from "@/components/AmenitiesSection";
import ReadyToBookSection from "@/components/ReadyToBookSection";
import OwnerSection from "@/components/OwnerSection";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <main className="min-h-screen bg-[#f3f3f3]">
      <Hero searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <AmenitiesSection />
      <ReadyToBookSection searchQuery={searchQuery} />
      <OwnerSection />
    </main>
  );
}
