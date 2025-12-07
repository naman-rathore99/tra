// lib/data.ts

export interface Room {
  id: string;
  name: string;
  type: "AC" | "Non-AC";
  price: number;
  bed: string;
  capacity: number; // This comes from your Onboarding Dashboard
  image: string;
}

export interface Destination {
  id: number;
  title: string;
  location: string;
  rating: number;
  description: string;
  image: string;
  price: number;
  amenities: string[];
  rooms: Room[];
  images: string[];
  // NEW FIELDS FROM ONBOARDING DASHBOARD
  hasBanquetHall: boolean;
  hallCapacity?: number;
}

const generateRooms = (basePrice: number): Room[] => [
  {
    id: "r1",
    name: "Standard Room",
    type: "Non-AC",
    price: basePrice,
    bed: "1 Queen Bed",
    capacity: 2, // Strict limit from dashboard
    image:
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "r2",
    name: "Family Suite",
    type: "AC",
    price: basePrice + 100,
    bed: "2 King Beds",
    capacity: 4, // Higher limit
    image:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=800&auto=format&fit=crop",
  },
];

export const allDestinations: Destination[] = [
  {
    title: "Thailand Grand Resort",
    location: "Bangkok, Thailand",
    rating: 4.9,
    description:
      "A tropical paradise featuring lively cities and stunning beaches.",
    image:
      "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?q=80&w=2600&auto=format&fit=crop",
    price: 120,
    amenities: ["Wifi", "Pool", "Air conditioning", "Spa"],
    rooms: generateRooms(120),
    images: [
      "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?q=80&w=2600&auto=format&fit=crop",
    ],
    // NEW DATA
    hasBanquetHall: true,
    hallCapacity: 200,
  },
  // ... other items (add hasBanquetHall: false to others to test)
].map((item, index) => ({ ...item, id: index + 1 }));

export function getDestinationById(
  id: string | number
): Destination | undefined {
  return allDestinations.find((dest) => String(dest.id) === String(id));
}
