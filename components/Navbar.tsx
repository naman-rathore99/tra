// components/Navbar.tsx
import React from "react";
import { Globe, Phone } from "lucide-react";

interface NavbarProps {
  variant?: "transparent" | "dark"; // Add variant prop
}

const Navbar = ({ variant = "transparent" }: NavbarProps) => {
  const isDark = variant === "dark";
  const textColor = isDark ? "text-gray-900" : "text-white";
  const borderColor = isDark ? "border-gray-200" : "border-white/30";
  const buttonBg = isDark ? "bg-black text-white" : "bg-white text-black";

  return (
    <nav
      className={`absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6 ${textColor}`}
    >
      <div className="text-2xl font-bold tracking-wide uppercase">
        Fluttertop.
      </div>

      <ul className="hidden md:flex items-center gap-8 text-sm font-medium">
        <li className="flex flex-col items-center gap-1 cursor-pointer group">
          <span>Home</span>
          <span
            className={`w-1.5 h-1.5 rounded-full opacity-100 transition-opacity ${
              isDark ? "bg-black" : "bg-white"
            }`}
          ></span>
        </li>
        <li className="opacity-80 hover:opacity-100 cursor-pointer transition-opacity">
          Book now
        </li>
        <li className="opacity-80 hover:opacity-100 cursor-pointer transition-opacity">
          Packages
        </li>
        <li className="opacity-80 hover:opacity-100 cursor-pointer transition-opacity">
          Popular places
        </li>
      </ul>

      <div className="flex items-center gap-4">
        <button
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border rounded-full hover:bg-opacity-10 transition-colors ${borderColor}`}
        >
          <Globe size={16} />
          <span>EN</span>
        </button>
        <button
          className={`flex items-center gap-2 px-5 py-2 text-sm font-medium rounded-full transition-colors ${buttonBg}`}
        >
          <Phone size={16} />
          <span>Contact us</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
