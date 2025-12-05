"use client";

import React, { useState, useEffect, useRef } from "react";
import Navbar from "./Navbar";
import {
  Search,
  MapPin,
  Calendar,
  Users,
  ArrowRight,
  Minus,
  Plus,
} from "lucide-react";
import { allDestinations, Destination } from "@/lib/data";

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

interface HeroProps {
  onSearch: (query: string, guests: number) => void;
}

const Hero = ({ onSearch }: HeroProps) => {
  const [query, setQuery] = useState("");
  const [guests, setGuests] = useState(1);
  const [date, setDate] = useState("");

  const [suggestions, setSuggestions] = useState<Destination[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const debouncedQuery = useDebounce(query, 300);
  const [showGuestPopup, setShowGuestPopup] = useState(false);

  const popupRef = useRef<HTMLDivElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (debouncedQuery.length < 2) {
      setSuggestions([]);
      return;
    }
    const lowerQuery = debouncedQuery.toLowerCase();
    const matches = allDestinations.filter(
      (dest) =>
        dest.title.toLowerCase().includes(lowerQuery) ||
        dest.location.toLowerCase().includes(lowerQuery)
    );
    setSuggestions(matches);
    setShowSuggestions(true);
  }, [debouncedQuery]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        setShowGuestPopup(false);
      }
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = () => {
    onSearch(query, guests);
    setShowSuggestions(false);
    const element = document.getElementById("destinations");
    element?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSuggestionClick = (destTitle: string) => {
    setQuery(destTitle);
    setShowSuggestions(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    // FIX 1: Removed 'overflow-hidden' from here so popups aren't clipped
    <div className="relative w-full max-w-[1400px] mx-auto p-4 z-10">
      {/* FIX 2: Created a specific wrapper for the background to handle rounded corners */}
      <div className="relative h-[85vh] w-full">
        {/* Background Layer (Absolute & Rounded) */}
        <div className="absolute inset-0 rounded-[2.5rem] overflow-hidden -z-10">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=2600&auto=format&fit=crop')",
            }}
          >
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />
          </div>
        </div>

        <Navbar />

        {/* Content Layer */}
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4 pt-20">
          <h1 className="text-5xl md:text-7xl font-medium text-white max-w-4xl leading-tight tracking-tight mb-12 drop-shadow-lg">
            Where every journey <br /> becomes an adventure.
          </h1>

          {/* Search Bar Container - High Z-Index */}
          <div
            className="relative z-50 w-full max-w-3xl"
            ref={searchContainerRef}
          >
            <div className="bg-white rounded-full p-2 pl-6 pr-2 flex flex-col md:flex-row items-center gap-4 md:gap-8 shadow-2xl w-full">
              {/* Location */}
              <div className="flex items-center gap-3 flex-1 w-full border-b md:border-b-0 md:border-r border-gray-200 py-2 md:py-0">
                <MapPin className="text-gray-400" size={20} />
                <div className="flex flex-col items-start w-full">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      setShowSuggestions(true);
                    }}
                    onFocus={() => {
                      if (query.length >= 2) setShowSuggestions(true);
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder="Where to? (e.g. Dubai)"
                    className="outline-none text-gray-700 placeholder-gray-400 w-full text-sm font-medium bg-transparent"
                  />
                </div>
              </div>

              {/* Date */}
              <div className="flex items-center gap-3 flex-1 w-full border-b md:border-b-0 md:border-r border-gray-200 py-2 md:py-0">
                <Calendar className="text-gray-400" size={20} />
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="outline-none text-gray-700 w-full text-sm font-medium bg-transparent uppercase cursor-pointer"
                  style={{ colorScheme: "light" }}
                />
              </div>

              {/* Guests */}
              <div className="relative flex-1 w-full" ref={popupRef}>
                <div
                  className="flex items-center gap-3 w-full py-2 md:py-0 cursor-pointer"
                  onClick={() => setShowGuestPopup(!showGuestPopup)}
                >
                  <Users className="text-gray-400" size={20} />
                  <span className="text-gray-700 text-sm font-medium select-none">
                    {guests} {guests === 1 ? "Guest" : "Guests"}
                  </span>
                </div>

                {/* Guest Popup - Fixed Z-Index & Background */}
                {showGuestPopup && (
                  <div className="absolute top-14 left-1/2 -translate-x-1/2 bg-white shadow-2xl rounded-2xl p-4 w-48 border border-gray-100 z-[60]">
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => setGuests(Math.max(1, guests - 1))}
                        className="p-2 hover:bg-gray-100 rounded-full"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="font-bold text-lg text-black">
                        {guests}
                      </span>
                      <button
                        onClick={() => setGuests(Math.min(10, guests + 1))}
                        className="p-2 hover:bg-gray-100 rounded-full"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={handleSearch}
                className="bg-black hover:bg-gray-800 text-white rounded-full px-8 py-3.5 flex items-center gap-2 transition-all active:scale-95"
              >
                <span>Search</span>
                <ArrowRight size={16} />
              </button>
            </div>

            {/* FIX 3: Suggestion Box - Strong Shadow, Background, High Z-Index */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 mt-4 w-full md:w-[40%] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-[100]">
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Suggested Destinations
                </div>
                {suggestions.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleSuggestionClick(item.title)}
                    className="flex items-center gap-4 p-4 hover:bg-blue-50 cursor-pointer transition-colors border-b border-gray-50 last:border-0"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-10 h-10 rounded-lg object-cover shadow-sm"
                    />
                    <div className="flex flex-col items-start">
                      <span className="font-bold text-gray-900 text-sm">
                        {item.title}
                      </span>
                      <span className="text-xs text-gray-500">
                        {item.location}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="absolute bottom-10 left-10 hidden md:flex gap-12 text-white z-20">
          <div className="flex flex-col">
            <span className="text-3xl font-semibold">200+</span>
            <span className="text-sm opacity-80 font-light">Destination</span>
          </div>
          <div className="flex flex-col">
            <span className="text-3xl font-semibold">10k+</span>
            <span className="text-sm opacity-80 font-light">
              Happy Customer
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
