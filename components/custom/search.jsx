// components/CharitySearch.jsx
"use client";
import { Search, Eye, EyeOff, X } from "lucide-react";
import { useState, useEffect } from "react";

const DirectSearch = ({ onSearch, blurEnabled, onToggleBlur }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  return (
    <div className={`w-full ${!isMobile ? 'mb-8' : ''}`}>
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-8 w-full">
        <div className="relative grow">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="size-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full dark:text-black p-3 sm:p-4 pl-10 text-sm border border-gray-300 rounded-lg bg-transparent backdrop-blur-3xl focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
            placeholder={isMobile ? "Search charities..." : "Search charities by name, mission, location, tags..."}
            value={searchQuery}
            onChange={handleSearch}
          />
          {searchQuery && (
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center pr-3"
              onClick={() => {
                setSearchQuery("");
                onSearch("");
              }}
            >
              <X className="size-4 text-gray-500 hover:text-gray-700" />
            </button>
          )}
        </div>

        <button
          onClick={onToggleBlur}
          className={`flex items-center justify-center bg-transparent backdrop-blur-3xl border border-primary text-primary gap-2 px-3 sm:px-4 py-3 sm:py-2 rounded-lg text-sm font-medium transition-colors duration-300`}
        >
          {blurEnabled ? (
            <>
              <EyeOff className="size-5" />
              <span className={isMobile ? 'sr-only' : ''}>Focus</span>
            </>
          ) : (
            <>
              <Eye className="size-5" />
              <span className={isMobile ? 'sr-only' : ''}>Unfocus</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default DirectSearch;
