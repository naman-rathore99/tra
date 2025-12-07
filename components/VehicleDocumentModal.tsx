"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Upload, CreditCard, Car } from "lucide-react";
import { Vehicle } from "@/lib/data";

interface Props {
  vehicle: Vehicle;
  onClose: () => void;
  onConfirm: (dlNumber: string) => void;
}

const VehicleDocumentModal = ({ vehicle, onClose, onConfirm }: Props) => {
  const [mounted, setMounted] = useState(false);

  // Form State
  const [dlNumber, setDlNumber] = useState("");
  const [dlImage, setDlImage] = useState<File | null>(null);
  const [aadharImage, setAadharImage] = useState<File | null>(null);

  useEffect(() => {
    setMounted(true);
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  if (!mounted) return null;

  const handleSubmit = () => {
    if (!dlImage || !aadharImage) {
      alert("Please upload both Driving License and Aadhaar Card images.");
      return;
    }
    // In a real app, you would upload these files here.
    onConfirm(dlNumber);
  };

  const modalContent = (
    <div className="fixed inset-0 z-[99999] h-screen w-screen bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div
        className="bg-white w-full max-w-md rounded-[2rem] p-6 shadow-2xl relative animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Rent {vehicle.name}
            </h2>
            <p className="text-xs text-gray-500">ID Verification Required</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6">
          {/* 1. Driving License Section */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
            <div className="flex items-center gap-2 mb-3">
              <Car size={18} className="text-gray-900" />
              <h3 className="font-bold text-sm">Driving License</h3>
            </div>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="DL Number (Optional)"
                value={dlNumber}
                onChange={(e) => setDlNumber(e.target.value)}
                className="w-full text-sm p-3 rounded-lg border border-gray-200 outline-none focus:border-black"
              />

              <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  {dlImage ? (
                    <span className="text-sm font-bold text-green-600 truncate px-4">
                      {dlImage.name}
                    </span>
                  ) : (
                    <>
                      <Upload size={20} className="text-gray-400 mb-1" />
                      <p className="text-xs text-gray-500">Upload DL Image</p>
                    </>
                  )}
                </div>
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => setDlImage(e.target.files?.[0] || null)}
                />
              </label>
            </div>
          </div>

          {/* 2. Aadhaar Section */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
            <div className="flex items-center gap-2 mb-3">
              <CreditCard size={18} className="text-gray-900" />
              <h3 className="font-bold text-sm">
                Aadhaar Card <span className="text-red-500">*</span>
              </h3>
            </div>

            <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                {aadharImage ? (
                  <span className="text-sm font-bold text-green-600 truncate px-4">
                    {aadharImage.name}
                  </span>
                ) : (
                  <>
                    <Upload size={20} className="text-gray-400 mb-1" />
                    <p className="text-xs text-gray-500">
                      Upload Aadhaar Front
                    </p>
                  </>
                )}
              </div>
              <input
                type="file"
                className="hidden"
                onChange={(e) => setAadharImage(e.target.files?.[0] || null)}
              />
            </label>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full py-4 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition-transform active:scale-95 shadow-lg"
          >
            Verify & Add Vehicle
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default VehicleDocumentModal;
