"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import DirectSearch from "../../components/custom/search";
import charities from "../../db/charities.json";

interface Charity {
  id: number;
  nickname: string;
  image: string;
  title: string;
  mission: string;
  tags: string[];
  verified: boolean;
  premium: boolean;
  bgGradient: string;
  location: string;
  fullContext: string;
  email: string;
  president: string;
  founder: string;
  registrationNumber: string;
}

const Page = () => {
  const [spotlightId, setSpotlightId] = useState<number | null>(null);
  const [filteredCharities, setFilteredCharities] =
    useState<Charity[]>(charities);
  const [searchActive, setSearchActive] = useState<boolean>(false);
  const [blurEnabled, setBlurEnabled] = useState<boolean>(true);
  const spotlightTimerRef = useRef<NodeJS.Timeout | null>(null);
  const resetTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Handle search functionality
  const handleSearch = (query: string): void => {
    if (!query.trim()) {
      setFilteredCharities(charities);
      setSearchActive(false);
      return;
    }

    setSearchActive(true);
    const lowercaseQuery = query.toLowerCase();

    const filtered = charities.filter((charity) => {
      return (
        charity.title.toLowerCase().includes(lowercaseQuery) ||
        charity.mission.toLowerCase().includes(lowercaseQuery) ||
        charity.location.toLowerCase().includes(lowercaseQuery) ||
        charity.fullContext.toLowerCase().includes(lowercaseQuery) ||
        charity.president.toLowerCase().includes(lowercaseQuery) ||
        charity.founder.toLowerCase().includes(lowercaseQuery) ||
        charity.email.toLowerCase().includes(lowercaseQuery) ||
        charity.registrationNumber.toLowerCase().includes(lowercaseQuery) ||
        charity.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery))
      );
    });

    setFilteredCharities(filtered);
  };

  const handleToggleBlur = (): void => {
    setBlurEnabled(!blurEnabled);
  };

  useEffect(() => {
    if (searchActive || !blurEnabled) {
      if (spotlightTimerRef.current) clearTimeout(spotlightTimerRef.current);
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
      setSpotlightId(null);
      return;
    }

    const pickRandomCharity = (): void => {
      if (filteredCharities.length === 0) return;

      const randomIndex = Math.floor(Math.random() * filteredCharities.length);
      setSpotlightId(filteredCharities[randomIndex].id);

      spotlightTimerRef.current = setTimeout(() => {
        setSpotlightId(null);

        resetTimerRef.current = setTimeout(pickRandomCharity, 2000);
      }, 2000);
    };

    pickRandomCharity();
    return () => {
      if (spotlightTimerRef.current) clearTimeout(spotlightTimerRef.current);
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    };
  }, [searchActive, filteredCharities, blurEnabled]);

  return (
    <div className="p-6 pt-16">
      <DirectSearch
        onSearch={handleSearch}
        blurEnabled={blurEnabled}
        onToggleBlur={handleToggleBlur}
      />

      <div className="w-full">
        {filteredCharities.length === 0 ? (
          <div className="text-center py-10">
            <h2 className="text-xl font-semibold text-gray-700">
              No charities found
            </h2>
            <p className="mt-2 text-gray-500">
              Try adjusting your search terms
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredCharities.map((charity) => (
              <div
                key={charity.id}
                className={`border overflow-hidden shadow-md transition-all duration-700 hover:scale-115 hover:z-10 hover:shadow-xl hover:blur-0 bg-gradient-to-br ${charity.bgGradient} ${
                  spotlightId === charity.id && blurEnabled && !searchActive
                    ? "blur-0 scale-105 z-10 shadow-xl"
                    : !blurEnabled || searchActive
                      ? ""
                      : "blur-sm"
                }`}
              >
                <Link href={`charity/${charity.nickname}`}>
                  <div className="h-48 overflow-hidden relative group">
                    <div className="relative size-full">
                      <Image
                        src={charity.image}
                        alt={charity.title}
                        fill
                        className={`object-cover contrast-125 transition-all duration-700 ease-in-out ${
                          (spotlightId === charity.id &&
                            blurEnabled &&
                            !searchActive) ||
                          !blurEnabled
                            ? "grayscale-0"
                            : "grayscale"
                        } hover:grayscale-0`}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                    <div
                      className={`absolute bottom-2 right-2 flex space-x-1 transition-opacity duration-300  ${
                        (spotlightId === charity.id &&
                          blurEnabled &&
                          !searchActive) ||
                        searchActive ||
                        !blurEnabled
                          ? "opacity-100"
                          : "opacity-0"
                      } group-hover:opacity-100`}
                    >
                      {charity.verified && (
                        <span className="bg-primary/30 border backdrop-blur-md border-primary text-white text-xs px-2 py-1 rounded-bl-none rounded-tr-none rounded shadow-md">
                          Verified
                        </span>
                      )}
                      {charity.premium && (
                        <span className="bg-[#f7931a]/30 border border-[#f7931a] backdrop-blur-md text-white text-xs px-2 py-1 rounded-tl-none rounded-br-none rounded ">
                          Premium
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-bold dark:text-white text-black">
                        {charity.title}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      {charity.mission}
                    </p>
                    <div className="flex flex-wrap gap-1 justify-end ">
                      {charity.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="bg-gray-200/20 dark:bg-white/20 dark:text-white dark:border-white border border-black dark:hover:border dark:hover:text-primary hover:bg-primary/20 hover:border-primary hover:text-primary dark:hover:border-primary text-gray-700 text-xs px-2 py-1 "
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
