// components/DestinationSection.tsx
import React from "react";
import { Star, MapPin } from "lucide-react";
import { Destination } from "@/lib/data"; // Import the type

interface DestinationSectionProps {
  destinations: Destination[];
}

const DestinationSection = ({ destinations }: DestinationSectionProps) => {
  return (
    <section id="destinations" className="max-w-[1400px] mx-auto px-8 py-16">
      <div className="mb-10">
        <h2 className="text-4xl font-medium text-gray-900 mb-4">
          What are you looking for?
        </h2>
        <p className="text-gray-500 max-w-2xl font-light">
          {destinations.length > 0
            ? `Found ${destinations.length} perfect destinations for your adventure.`
            : "We couldn't find any destinations matching your search. Try 'Thailand' or 'Europe'."}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {destinations.map((item) => (
          <div key={item.id} className="group cursor-pointer">
            {/* Image Card */}
            <div className="relative h-64 w-full rounded-2xl overflow-hidden mb-4">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1 text-xs font-medium text-gray-700">
                <MapPin size={12} />
                {item.location}
              </div>
              <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-white">
                ${item.price}/night
              </div>
            </div>

            {/* Content */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <h3 className="text-xl font-bold text-gray-900">
                  {item.title}
                </h3>
                <div className="flex items-center gap-1">
                  {/* Simple star logic */}
                  <Star size={14} className="text-black fill-black" />
                  <span className="text-sm font-medium ml-1">
                    {item.rating}
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default DestinationSection;
