"use client";

import React, { useState, useEffect } from "react";
import {
  Star,
  MapPin,
  ArrowLeft,
  Users,
  Minus,
  Plus,
  Info,
  PartyPopper,
  Check,
  Car,
  Fuel,
} from "lucide-react";
import { Destination, Vehicle } from "@/lib/data";
import ImageGallery from "./ImageGallery";
import VehicleDocumentModal from "./VehicleDocumentModal";
import BookingReviewModal from "./BookingSuccessModal";

interface DestinationDetailsProps {
  destination: Destination;
  onBack: () => void;
  initialData?: {
    start: string;
    end: string;
    adults: number;
    children: number;
  };
}

const DestinationDetails = ({
  destination,
  onBack,
  initialData,
}: DestinationDetailsProps) => {
  // --- STATE ---
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [includeHall, setIncludeHall] = useState(false);

  // VEHICLE STATE
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [pendingVehicle, setPendingVehicle] = useState<Vehicle | null>(null); // Track which vehicle was clicked before docs upload

  // Date/Guest State
  const [startDate, setStartDate] = useState(initialData?.start || "");
  const [endDate, setEndDate] = useState(initialData?.end || "");
  const [nights, setNights] = useState(1);
  const [adults, setAdults] = useState(initialData?.adults || 2);
  const [children, setChildren] = useState(initialData?.children || 0);

  const [showGuestPopup, setShowGuestPopup] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);

  // Data Helpers
  const rooms = destination.rooms || [];
  const galleryImages = destination.images?.length
    ? destination.images
    : [destination.image];
  const vehicles = destination.vehicles || [];

  // Calculations
  const currentRoom = rooms.find((r) => r.id === selectedRoom);
  const basePrice = currentRoom?.price || destination.price;
  const roomCapacity = currentRoom?.capacity || 2;
  const totalGuests = adults + children;
  const roomsNeeded = selectedRoom ? Math.ceil(totalGuests / roomCapacity) : 1;

  const hallPrice = includeHall ? 500 : 0;
  // Vehicle Price Calculation: (Price * Nights)
  const vehicleTotal = selectedVehicle ? selectedVehicle.price * nights : 0;

  const totalRoomCost = basePrice * nights * roomsNeeded;
  const grandTotal = totalRoomCost + hallPrice + vehicleTotal;

  // Effects
  useEffect(() => {
    if (startDate && endDate) {
      const s = new Date(startDate);
      const e = new Date(endDate);
      const diff = Math.ceil(
        (e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)
      );
      setNights(diff > 0 ? diff : 1);
    }
  }, [startDate, endDate]);

  // Handlers
  const handleVehicleClick = (vehicle: Vehicle) => {
    // If clicking the same vehicle, deselect it
    if (selectedVehicle?.id === vehicle.id) {
      setSelectedVehicle(null);
      return;
    }
    // Open modal to get docs
    setPendingVehicle(vehicle);
    setIsVehicleModalOpen(true);
  };

  const handleVehicleConfirm = (dlNumber: string) => {
    // Docs uploaded successfully
    setSelectedVehicle(pendingVehicle);
    setIsVehicleModalOpen(false);
    setPendingVehicle(null);
  };

  return (
    <>
      {/* --- MODALS --- */}
      {showReviewModal && (
        <BookingReviewModal
          destination={destination}
          roomName={`${currentRoom?.name || "Standard"} (x${roomsNeeded})`}
          // We pass extra details via prop drilling or updating the modal to accept a config object.
          // For now, let's just pass the Grand Total.
          pricePerNight={grandTotal}
          startDate={startDate}
          endDate={endDate}
          nights={nights}
          guests={totalGuests}
          onClose={() => setShowReviewModal(false)}
          onConfirm={() => alert("Payment...")}
          // You should update BookingReviewModal to accept vehicle details if you want to show them there
        />
      )}

      {isVehicleModalOpen && pendingVehicle && (
        <VehicleDocumentModal
          vehicle={pendingVehicle}
          onClose={() => setIsVehicleModalOpen(false)}
          onConfirm={handleVehicleConfirm}
        />
      )}

      {/* --- CONTENT --- */}
      <div className="min-h-screen bg-white animate-in fade-in duration-500">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 pt-32 pb-20">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-black mb-6"
          >
            <ArrowLeft size={18} /> Back to results
          </button>

          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
            <div>
              <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-2">
                {destination.title}
              </h1>
              <div className="flex items-center gap-2 text-gray-500">
                <MapPin size={18} /> {destination.location}
              </div>
            </div>
          </div>

          <ImageGallery images={galleryImages} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative">
            <div className="lg:col-span-2 space-y-12">
              {/* ... About Section ... */}

              {/* ROOM SELECTION */}
              <section>
                <h2 className="text-2xl font-bold mb-6">Select Room</h2>
                <div className="space-y-4">
                  {rooms.map((room) => (
                    <div
                      key={room.id}
                      onClick={() => setSelectedRoom(room.id)}
                      className={`border rounded-2xl p-4 flex gap-4 cursor-pointer transition-all ${
                        selectedRoom === room.id
                          ? "border-black ring-1 ring-black bg-gray-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <img
                        src={room.image}
                        className="w-32 h-24 rounded-lg object-cover bg-gray-200"
                      />
                      <div className="flex-grow">
                        <h3 className="font-bold">{room.name}</h3>
                        <div className="text-sm text-gray-500 mt-1">
                          {room.type} • {room.capacity} Guests
                        </div>
                        <div className="font-bold mt-2 text-lg">
                          ${room.price}
                        </div>
                      </div>
                      {selectedRoom === room.id && (
                        <div className="w-6 h-6 bg-black rounded-full text-white flex items-center justify-center">
                          <Check size={14} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>

              {/* NEW SECTION: VEHICLE RENTAL */}
              {vehicles.length > 0 && (
                <section>
                  <div className="flex items-center gap-2 mb-6">
                    <Car size={24} />
                    <h2 className="text-2xl font-bold">Add a Ride</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {vehicles.map((veh) => (
                      <div
                        key={veh.id}
                        onClick={() => handleVehicleClick(veh)}
                        className={`relative border rounded-2xl p-4 cursor-pointer transition-all group hover:shadow-md ${
                          selectedVehicle?.id === veh.id
                            ? "border-black bg-gray-900 text-white"
                            : "border-gray-200 bg-white"
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="font-bold text-lg">{veh.name}</div>
                          <div
                            className={`text-sm font-bold ${
                              selectedVehicle?.id === veh.id
                                ? "text-gray-300"
                                : "text-gray-900"
                            }`}
                          >
                            ${veh.price}/day
                          </div>
                        </div>
                        <div
                          className={`text-xs mb-3 flex items-center gap-3 ${
                            selectedVehicle?.id === veh.id
                              ? "text-gray-400"
                              : "text-gray-500"
                          }`}
                        >
                          <span className="flex items-center gap-1">
                            <Users size={12} /> {veh.seats} Seats
                          </span>
                          <span className="flex items-center gap-1">
                            <Fuel size={12} /> Petrol
                          </span>
                        </div>
                        <div className="h-32 w-full rounded-xl overflow-hidden bg-gray-100">
                          <img
                            src={veh.image}
                            className="w-full h-full object-cover mix-blend-multiply"
                            alt={veh.name}
                          />
                        </div>

                        {selectedVehicle?.id === veh.id && (
                          <div className="absolute top-4 right-4 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
                            <Check size={10} /> ADDED
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* BOOKING CARD */}
            <div className="relative">
              <div className="sticky top-32 bg-white rounded-2xl shadow-[0_6px_30px_rgba(0,0,0,0.12)] border border-gray-100 p-6">
                <div className="flex justify-between items-end mb-6">
                  <div>
                    <span className="text-3xl font-bold text-gray-900">
                      ${grandTotal}
                    </span>
                    <span className="text-gray-500 text-sm font-medium">
                      {" "}
                      total
                    </span>
                  </div>
                </div>

                {/* ... Date & Guest Inputs ... */}
                <div className="border border-gray-200 rounded-xl mb-4 divide-y divide-gray-200">
                  {/* (Include your Date/Guest Inputs Here from previous code) */}
                  <div className="flex">
                    <div className="p-3 w-1/2 border-r border-gray-200">
                      <label className="text-[10px] font-bold text-gray-800 uppercase block mb-1">
                        Check-in
                      </label>
                      <input
                        type="date"
                        className="w-full text-sm outline-none bg-transparent font-medium"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                    </div>
                    <div className="p-3 w-1/2">
                      <label className="text-[10px] font-bold text-gray-800 uppercase block mb-1">
                        Check-out
                      </label>
                      <input
                        type="date"
                        className="w-full text-sm outline-none bg-transparent font-medium"
                        min={startDate}
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="p-3">
                    <div className="text-[10px] font-bold text-gray-800 uppercase block mb-1">
                      Guests
                    </div>
                    <div className="text-sm font-bold">
                      {adults} Adults, {children} Kids
                    </div>
                  </div>
                </div>

                {/* SELECTED EXTRAS SUMMARY */}
                {(includeHall || selectedVehicle) && (
                  <div className="mb-4 space-y-2">
                    {includeHall && (
                      <div className="flex justify-between text-xs text-purple-700 bg-purple-50 p-2 rounded-lg">
                        <span className="font-bold flex items-center gap-1">
                          <PartyPopper size={12} /> Banquet Hall
                        </span>
                        <span>${hallPrice}</span>
                      </div>
                    )}
                    {selectedVehicle && (
                      <div className="flex justify-between text-xs text-blue-700 bg-blue-50 p-2 rounded-lg">
                        <span className="font-bold flex items-center gap-1">
                          <Car size={12} /> {selectedVehicle.name}
                        </span>
                        <span>${vehicleTotal}</span>
                      </div>
                    )}
                  </div>
                )}

                <button
                  disabled={!selectedRoom}
                  onClick={() => setShowReviewModal(true)}
                  className={`w-full py-4 rounded-xl font-bold text-white transition-all shadow-lg ${
                    !selectedRoom
                      ? "bg-gray-200 cursor-not-allowed"
                      : "bg-black hover:bg-gray-800 shadow-black/20"
                  }`}
                >
                  {selectedRoom ? `Reserve` : "Select a Room"}
                </button>

                {/* PRICE BREAKDOWN */}
                {selectedRoom && (
                  <div className="mt-4 flex flex-col gap-1 border-t pt-3 text-xs text-gray-500">
                    <div className="flex justify-between">
                      <span>
                        Rooms ({roomsNeeded} x ${basePrice} x {nights}n)
                      </span>
                      <span>${totalRoomCost}</span>
                    </div>
                    {selectedVehicle && (
                      <div className="flex justify-between text-blue-600 font-medium">
                        <span>Vehicle ({nights} days)</span>
                        <span>${vehicleTotal}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-black border-t border-dashed pt-2 mt-2">
                      <span>Total</span>
                      <span>${grandTotal}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DestinationDetails;
