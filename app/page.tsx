// app/page.tsx
"use client";

import React, { useState } from "react";
import Hero from "@/components/Hero";
import DestinationSection from "@/components/DestinationSection";
import SearchResults from "@/components/SearchResults";
import Navbar from "@/components/Navbar";
import { allDestinations, Destination } from "@/lib/data";

export default function Home() {
  const [view, setView] = useState<"home" | "search">("home");
  const [filteredDestinations, setFilteredDestinations] =
    useState<Destination[]>(allDestinations);

  // State to pass to the results page
  const [searchParams, setSearchParams] = useState({ query: "", guests: 1 });

  const handleSearch = (query: string, guests: number) => {
    setSearchParams({ query, guests });

    // Filter logic
    const lowerQuery = query.toLowerCase();
    const results = allDestinations.filter((dest) => {
      const matchTitle = dest.title.toLowerCase().includes(lowerQuery);
      const matchLoc = dest.location.toLowerCase().includes(lowerQuery);
      return matchTitle || matchLoc;
    });

    setFilteredDestinations(results);

    // Switch View
    setView("search");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // View: Search Results (Propel Style)
  if (view === "search") {
    return (
      <main className="min-h-screen bg-white">
        {/* Pass 'dark' variant so navbar is visible on white background */}
        <div className="relative">
          <Navbar variant="dark" />
        </div>
        <SearchResults
          initialQuery={searchParams.query}
          initialGuests={searchParams.guests}
          results={filteredDestinations}
          onBack={() => setView("home")}
        />
      </main>
    );
  }

  // View: Landing Page (Fluttertop Style)
  return (
    <main className="min-h-screen bg-white">
      <Hero onSearch={handleSearch} />
      <DestinationSection destinations={filteredDestinations} />
    </main>
  );
}
