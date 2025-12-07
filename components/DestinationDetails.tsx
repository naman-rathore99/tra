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
  Calendar,
} from "lucide-react";
import { Destination } from "@/lib/data";
import ImageGallery from "./ImageGallery";
import BookingReviewModal from "./BookingSuccessModal";

interface DestinationDetailsProps {
  destination: Destination;
  onBack: () => void;
  // Receiving the data
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
  // --- HELPER: CALCULATE NIGHTS INITIAL STATE ---
  // We do this to ensure the price is correct on the very first render
  const getInitialNights = () => {
    if (initialData?.start && initialData?.end) {
      const s = new Date(initialData.start);
      const e = new Date(initialData.end);
      const diff = Math.ceil(
        (e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)
      );
      return diff > 0 ? diff : 1;
    }
    return 1;
  };

  // --- STATE ---
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [includeHall, setIncludeHall] = useState(false);

  // Initialize State with URL Data
  const [startDate, setStartDate] = useState(initialData?.start || "");
  const [endDate, setEndDate] = useState(initialData?.end || "");
  const [adults, setAdults] = useState(initialData?.adults || 1);
  const [children, setChildren] = useState(initialData?.children || 0);
  const [nights, setNights] = useState(getInitialNights()); // <--- USE HELPER HERE

  const [showGuestPopup, setShowGuestPopup] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);

  // --- DATA ---
  const rooms = destination.rooms || [];
  const galleryImages = destination.images?.length
    ? destination.images
    : [destination.image];

  // --- LIVE CALCULATIONS ---
  const currentRoom = rooms.find((r) => r.id === selectedRoom);
  const basePrice = currentRoom?.price || destination.price;
  const roomCapacity = currentRoom?.capacity || 2;
  const totalGuests = adults + children;

  const roomsNeeded = selectedRoom ? Math.ceil(totalGuests / roomCapacity) : 1;
  const hallPrice = includeHall ? 500 : 0;

  // CALCULATE TOTAL
  const totalRoomCost = basePrice * nights * roomsNeeded;
  const grandTotal = totalRoomCost + hallPrice;

  // --- EFFECT: Recalculate nights if user changes dates manually ---
  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = end.getTime() - start.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays > 0) setNights(diffDays);
    }
  }, [startDate, endDate]);

  return (
    <>
      {showReviewModal && (
        <BookingReviewModal
          destination={destination}
          roomName={`${currentRoom?.name || "Standard"} (x${roomsNeeded}) ${
            includeHall ? "+ Hall" : ""
          }`}
          pricePerNight={grandTotal}
          startDate={startDate}
          endDate={endDate}
          nights={nights}
          guests={totalGuests}
          onClose={() => setShowReviewModal(false)}
          onConfirm={() => alert("Payment")}
        />
      )}

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
              {destination.hasBanquetHall && (
                <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-bold uppercase tracking-wider rounded-full inline-flex items-center gap-1">
                  <PartyPopper size={12} /> Hall Available
                </span>
              )}
              <div className="flex items-center gap-2 text-gray-500 mt-2">
                <MapPin size={18} /> {destination.location}
              </div>
            </div>
          </div>

          <ImageGallery images={galleryImages} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative text-black">
            <div className="lg:col-span-2 space-y-12">
              <section>
                <h2 className="text-2xl font-bold mb-4">About</h2>
                <p className="text-gray-600 leading-relaxed text-lg">
                  {destination.description}
                </p>
              </section>

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
                        <div className="flex justify-between items-start">
                          <h3 className="font-bold">{room.name}</h3>
                          <div className="font-bold text-lg">${room.price}</div>
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          {room.type} • Fits {room.capacity}
                        </div>
                        {totalGuests > room.capacity && (
                          <div className="mt-2 inline-flex items-center gap-1 text-[10px] bg-orange-100 text-orange-700 px-2 py-1 rounded font-bold">
                            <Info size={10} /> Auto-adding rooms for{" "}
                            {totalGuests} guests
                          </div>
                        )}
                      </div>
                      <div className="ml-auto flex items-center pl-2">
                        <div
                          className={`w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center ${
                            selectedRoom === room.id
                              ? "bg-black border-black"
                              : "bg-white"
                          }`}
                        >
                          {selectedRoom === room.id && (
                            <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* STICKY BOOKING CARD */}
            <div className="relative">
              <div className="sticky top-32 bg-white rounded-2xl shadow-[0_6px_30px_rgba(0,0,0,0.12)] border border-gray-100 p-6">
                {/* Price Header */}
                <div className="flex justify-between items-end mb-6">
                  <div>
                    <span className="text-4xl font-bold text-gray-900">
                      ${grandTotal}
                    </span>
                    <span className="text-gray-500 text-sm font-medium">
                      {" "}
                      total
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                      Per Room
                    </div>
                    <div className="font-semibold text-sm text-gray-900">
                      ${basePrice} / night
                    </div>
                  </div>
                </div>

                {/* Inputs Container */}
                <div className="border border-gray-200 rounded-xl mb-4 divide-y divide-gray-200">
                  {/* Dates */}
                  <div className="flex">
                    <div className="p-3 w-1/2 border-r border-gray-200">
                      <label className="text-[10px] font-bold text-gray-800 uppercase block mb-1">
                        Check-in
                      </label>
                      <input
                        type="date"
                        className="w-full text-sm outline-none bg-transparent font-bold text-gray-900"
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
                        className="w-full text-sm outline-none bg-transparent font-bold text-gray-900"
                        min={startDate}
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Guests */}
                  <div
                    className="relative p-3 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => setShowGuestPopup(!showGuestPopup)}
                  >
                    <label className="text-[10px] font-bold text-gray-800 uppercase block mb-1">
                      GUESTS
                    </label>
                    <div className="text-sm font-bold text-gray-900 flex justify-between items-center">
                      <span>
                        {adults} Adults, {children} Kids
                      </span>
                      <Users size={16} className="text-gray-400" />
                    </div>

                    {showGuestPopup && (
                      <div
                        className="absolute top-full left-0 right-0 mt-2 bg-white shadow-xl rounded-xl p-4 z-50 border border-gray-100"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex justify-between items-center mb-4">
                          <span className="font-bold text-sm">Adults</span>
                          <div className="flex gap-3">
                            <button
                              onClick={() => setAdults(Math.max(1, adults - 1))}
                              className="w-6 h-6 rounded-full border hover:bg-gray-100 flex items-center justify-center"
                            >
                              <Minus size={12} />
                            </button>
                            <span>{adults}</span>
                            <button
                              onClick={() => setAdults(adults + 1)}
                              className="w-6 h-6 rounded-full border hover:bg-gray-100 flex items-center justify-center"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-sm">Children</span>
                          <div className="flex gap-3">
                            <button
                              onClick={() =>
                                setChildren(Math.max(0, children - 1))
                              }
                              className="w-6 h-6 rounded-full border hover:bg-gray-100 flex items-center justify-center"
                            >
                              <Minus size={12} />
                            </button>
                            <span>{children}</span>
                            <button
                              onClick={() => setChildren(children + 1)}
                              className="w-6 h-6 rounded-full border hover:bg-gray-100 flex items-center justify-center"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                        </div>
                        <div className="text-right mt-3">
                          <button
                            onClick={() => setShowGuestPopup(false)}
                            className="text-xs font-bold underline"
                          >
                            Close
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Hall Toggle */}
                {destination.hasBanquetHall && (
                  <div
                    className={`mb-4 p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-colors ${
                      includeHall
                        ? "bg-purple-50 border-purple-500"
                        : "border-gray-200 hover:border-purple-200"
                    }`}
                    onClick={() => setIncludeHall(!includeHall)}
                  >
                    <div
                      className={`w-5 h-5 rounded border flex items-center justify-center ${
                        includeHall
                          ? "bg-purple-600 border-purple-600"
                          : "bg-white border-gray-300"
                      }`}
                    >
                      {includeHall && (
                        <Check size={12} className="text-white" />
                      )}
                    </div>
                    <div className="text-sm">
                      <span
                        className={`font-bold block ${
                          includeHall ? "text-purple-900" : "text-gray-900"
                        }`}
                      >
                        Add Banquet Hall
                      </span>
                      <span className="text-xs text-gray-500">
                        +$500 Flat Fee
                      </span>
                    </div>
                  </div>
                )}

                {/* Reserve Button */}
                <button
                  disabled={!selectedRoom}
                  onClick={() => setShowReviewModal(true)}
                  className={`w-full py-4 rounded-xl font-bold text-white text-lg transition-all shadow-lg ${
                    !selectedRoom
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
                      : "bg-black hover:bg-gray-800 shadow-black/20"
                  }`}
                >
                  {selectedRoom
                    ? `Reserve ${roomsNeeded} Room${roomsNeeded > 1 ? "s" : ""}`
                    : "Select a Room"}
                </button>

                {/* Breakdown */}
                <div className="mt-4 flex flex-col gap-1 border-t pt-3 text-xs text-gray-500">
                  {selectedRoom ? (
                    <>
                      <div className="flex justify-between">
                        <span>
                          ${basePrice} x {roomsNeeded} rooms x {nights} nights
                        </span>
                        <span>${totalRoomCost}</span>
                      </div>
                      {includeHall && (
                        <div className="flex justify-between text-purple-700 font-medium">
                          <span>Banquet Hall Fee</span>
                          <span>${hallPrice}</span>
                        </div>
                      )}
                      <div className="flex justify-between font-bold text-black border-t border-dashed pt-2 mt-2">
                        <span>Total</span>
                        <span>${grandTotal}</span>
                      </div>
                    </>
                  ) : (
                    <p className="text-center">You won't be charged yet</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DestinationDetails;
