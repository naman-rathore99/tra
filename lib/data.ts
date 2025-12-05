// lib/data.ts

export interface Destination {
  id: number;
  title: string;
  location: string;
  rating: number;
  description: string;
  image: string;
  price: number;
  amenities: string[]; // Added this
}

export const allDestinations: Destination[] = [
  {
    id: 1,
    title: "Thailand",
    location: "Bangkok",
    rating: 5.0,
    description:
      "Explore Thailand's lively cities and stunning tropical beaches.",
    image:
      "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?q=80&w=2600&auto=format&fit=crop",
    price: 120,
    amenities: ["Wifi", "Pool", "Air conditioning"],
  },
  {
    id: 2,
    title: "Europe",
    location: "Paris, France",
    rating: 4.8,
    description: "Experience Europe's rich history and diverse cultures.",
    image:
      "https://images.unsplash.com/photo-1471623432079-916ef5b5e9f6?q=80&w=2600&auto=format&fit=crop",
    price: 250,
    amenities: ["Wifi", "Kitchen", "Heating"],
  },
  {
    id: 3,
    title: "New York City",
    location: "Manhattan, NY",
    rating: 4.9,
    description:
      "Dive into the energy of New York City, the city that never sleeps.",
    image:
      "https://images.unsplash.com/photo-1496442226666-8d4a0e29f16e?q=80&w=2600&auto=format&fit=crop",
    price: 300,
    amenities: ["Wifi", "Gym", "Workplace"],
  },
  {
    id: 4,
    title: "Dubai",
    location: "Downtown Dubai",
    rating: 5.0,
    description:
      "Discover Dubai's stunning modern skyline and luxury shopping.",
    image:
      "https://images.unsplash.com/photo-1512453979798-5ea936a7fe48?q=80&w=2600&auto=format&fit=crop",
    price: 450,
    amenities: ["Wifi", "Pool", "Gym", "Air conditioning"],
  },
  {
    id: 5,
    title: "Bali",
    location: "Indonesia",
    rating: 4.7,
    description: "Find peace in the temples and rice terraces of Bali.",
    image:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=2600&auto=format&fit=crop",
    price: 90,
    amenities: ["Wifi", "Pool", "Kitchen"],
  },
];
