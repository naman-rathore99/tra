import React, { useState, useEffect } from "react";
import {
  Star,
  MapPin,
  Heart,
  Filter,
  Wifi,
  Wind,
  Car,
  Check,
  X,
} from "lucide-react";
import { Destination } from "@/lib/data";

interface SearchResultsProps {
  initialQuery: string;
  initialGuests: number;
  results: Destination[]; // The raw results from the initial search
  onBack: () => void;
}

const AMENITY_OPTIONS = [
  "Wifi",
  "Kitchen",
  "Air conditioning",
  "Pool",
  "Gym",
  "Heating",
];

const SearchResults = ({
  initialQuery,
  initialGuests,
  results: initialResults,
  onBack,
}: SearchResultsProps) => {
  // 1. Local State for Filters
  const [displayedResults, setDisplayedResults] =
    useState<Destination[]>(initialResults);
  const [priceRange, setPriceRange] = useState([0, 1000]); // [min, max]
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [activeSort, setActiveSort] = useState("Recommended");

  // 2. The Filtering Logic
  useEffect(() => {
    let filtered = initialResults.filter((item) => {
      // Price Filter
      const matchesPrice =
        item.price >= priceRange[0] && item.price <= priceRange[1];

      // Amenity Filter (Item must have ALL selected amenities)
      const matchesAmenities = selectedAmenities.every((amenity) =>
        item.amenities.includes(amenity)
      );

      return matchesPrice && matchesAmenities;
    });

    // Sort Logic
    if (activeSort === "Lowest Price") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (activeSort === "Top Rated") {
      filtered.sort((a, b) => b.rating - a.rating);
    }

    setDisplayedResults(filtered);
  }, [priceRange, selectedAmenities, activeSort, initialResults]);

  // Handler for Amenities
  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
    );
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB] pt-24 pb-10 px-4 md:px-8 font-sans">
      <div className="max-w-[1400px] mx-auto mb-8  top-20 z-30">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3 pl-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6 w-full">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <span className="text-gray-500 font-medium">Back</span>
            </button>
            <div className="h-8 w-px bg-gray-200"></div>
            <div className="flex flex-col">
              <span className="text-xs text-gray-400 font-bold tracking-wider uppercase">
                Destination
              </span>
              <span className="text-gray-900 font-semibold">
                {initialQuery || "Exploring All"}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center px-4 py-2 bg-gray-50 rounded-xl border border-gray-100">
              <span className="text-sm font-medium">
                {initialGuests} Guests
              </span>
            </div>
            <button className="bg-black text-white px-6 py-3 rounded-xl font-medium text-sm hover:bg-gray-800 transition-colors">
              Edit Search
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* --- 3. Sidebar Filters (Sticky & Functional) --- */}
        <div className="hidden lg:block lg:col-span-3 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm sticky top-44">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-gray-900">Filters</h3>
            <button
              onClick={() => {
                setPriceRange([0, 1000]);
                setSelectedAmenities([]);
              }}
              className="text-xs font-semibold text-gray-400 hover:text-black uppercase tracking-wide"
            >
              Reset
            </button>
          </div>

          {/* Price Range Slider */}
          <div className="mb-8">
            <h4 className="font-bold text-sm text-gray-900 mb-4">
              Price Range (Night)
            </h4>
            <div className="flex items-center justify-between mb-4">
              <div className="px-4 py-2 bg-gray-50 rounded-lg border border-gray-100 text-sm font-bold text-gray-700">
                ${priceRange[0]}
              </div>
              <div className="w-4 h-[2px] bg-gray-300"></div>
              <div className="px-4 py-2 bg-gray-50 rounded-lg border border-gray-100 text-sm font-bold text-gray-700">
                ${priceRange[1]}
              </div>
            </div>
            {/* Simple Range Input */}
            <input
              type="range"
              min="0"
              max="1000"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
              className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
            />
          </div>

          <div className="h-px bg-gray-100 w-full mb-8"></div>

          {/* Amenities Checkboxes */}
          <div className="space-y-4">
            <h4 className="font-bold text-sm text-gray-900 mb-2">Amenities</h4>
            {AMENITY_OPTIONS.map((item) => {
              const isSelected = selectedAmenities.includes(item);
              return (
                <div
                  key={item}
                  onClick={() => toggleAmenity(item)}
                  className="flex items-center justify-between cursor-pointer group select-none"
                >
                  <span
                    className={`text-sm transition-colors ${
                      isSelected
                        ? "text-black font-medium"
                        : "text-gray-500 group-hover:text-gray-700"
                    }`}
                  >
                    {item}
                  </span>
                  <div
                    className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${
                      isSelected
                        ? "bg-black border-black text-white"
                        : "bg-white border-gray-300 group-hover:border-gray-400"
                    }`}
                  >
                    {isSelected && <Check size={12} strokeWidth={3} />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* --- 4. Main Results List --- */}
        <div className="lg:col-span-9 space-y-6">
          {/* Sort Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            {["Recommended", "Top Rated", "Lowest Price"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveSort(tab)}
                className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all border ${
                  activeSort === tab
                    ? "bg-black text-white border-black"
                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Result Cards */}
          {displayedResults.map((place) => (
            <div
              key={place.id}
              className="bg-white rounded-[24px] p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col md:flex-row gap-6 group"
            >
              {/* Image Section */}
              <div className="relative w-full md:w-[280px] h-64 md:h-[200px] shrink-0 rounded-[20px] overflow-hidden">
                <img
                  src={place.image}
                  alt={place.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <button className="absolute top-3 right-3 p-2 bg-white/60 backdrop-blur-md rounded-full hover:bg-white transition-colors">
                  <Heart size={18} className="text-gray-700" />
                </button>
              </div>

              {/* Info Section */}
              <div className="flex flex-col justify-between py-1 flex-grow pr-2">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 leading-tight">
                        {place.title}
                      </h3>
                      <div className="flex items-center gap-1.5 text-gray-500 text-sm mt-1">
                        <MapPin size={14} />
                        {place.location}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-lg border border-gray-100">
                      <Star size={14} className="fill-black text-black" />
                      <span className="font-bold text-gray-900 text-sm">
                        {place.rating}
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-500 text-sm line-clamp-2 mb-4 leading-relaxed">
                    {place.description}
                  </p>

                  {/* Dynamic Amenities Badges */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {place.amenities.slice(0, 3).map((am) => (
                      <span
                        key={am}
                        className="text-[10px] uppercase font-bold text-gray-500 bg-gray-50 px-2 py-1 rounded-md border border-gray-100"
                      >
                        {am}
                      </span>
                    ))}
                    {place.amenities.length > 3 && (
                      <span className="text-[10px] font-bold text-gray-400 px-1 py-1">
                        + {place.amenities.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Price & Action */}
                <div className="flex items-end justify-between border-t border-gray-100 pt-4 mt-2">
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-400 font-medium line-through decoration-gray-300">
                      ${place.price + 50}
                    </span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold text-gray-900">
                        ${place.price}
                      </span>
                      <span className="text-gray-500 text-sm font-medium">
                        /night
                      </span>
                    </div>
                  </div>

                  <button className="bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-xl font-bold text-sm transition-all transform active:scale-95 shadow-lg shadow-gray-200">
                    View Deal
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* No Results State */}
          {displayedResults.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-100 border-dashed">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <Filter size={24} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">
                No matches found
              </h3>
              <p className="text-gray-500 text-sm text-center max-w-xs">
                Try adjusting your price range or removing some amenity filters.
              </p>
              <button
                onClick={() => {
                  setPriceRange([0, 1000]);
                  setSelectedAmenities([]);
                }}
                className="mt-6 text-black font-semibold text-sm underline underline-offset-4"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
