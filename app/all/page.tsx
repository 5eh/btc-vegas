"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import DirectSearch from "../../components/custom/search";

interface Organization {
  id: string;
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
  banner: string;
  bitcoinAddress: string;
  website: string;
  startDate: string;
  customMessage: string;
  createdAt: string;
  updatedAt: string;
}

const Page = () => {
  const [spotlightId, setSpotlightId] = useState<string | null>(null);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [filteredOrganizations, setFilteredOrganizations] = useState<
    Organization[]
  >([]);
  const [searchActive, setSearchActive] = useState<boolean>(false);
  const [blurEnabled, setBlurEnabled] = useState<boolean>(true);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const spotlightTimerRef = useRef<NodeJS.Timeout | null>(null);
  const resetTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleSearch = (query: string): void => {
    if (!query.trim()) {
      setFilteredOrganizations(organizations);
      setSearchActive(false);
      setIsSearching(false);
      return;
    }

    setSearchActive(true);
    setIsSearching(true);
    const lowercaseQuery = query.toLowerCase();

    const filtered = organizations.filter((org) => {
      return (
        org.title.toLowerCase().includes(lowercaseQuery) ||
        org.mission.toLowerCase().includes(lowercaseQuery) ||
        org.location.toLowerCase().includes(lowercaseQuery) ||
        org.fullContext.toLowerCase().includes(lowercaseQuery) ||
        org.president.toLowerCase().includes(lowercaseQuery) ||
        org.founder.toLowerCase().includes(lowercaseQuery) ||
        org.email.toLowerCase().includes(lowercaseQuery) ||
        org.registrationNumber.toLowerCase().includes(lowercaseQuery) ||
        (org.tags || []).some((tag: string) =>
          tag.toLowerCase().includes(lowercaseQuery),
        )
      );
    });

    setFilteredOrganizations(filtered);
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
      if (filteredOrganizations.length === 0) return;

      const randomIndex = Math.floor(
        Math.random() * filteredOrganizations.length,
      );
      setSpotlightId(filteredOrganizations[randomIndex].id);

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
  }, [searchActive, filteredOrganizations, blurEnabled]);

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const response = await fetch(`/api/organization/all`);
        if (!response.ok) {
          throw new Error("Failed to fetch organizations");
        }
        const data = await response.json();
        // Parse the JSONB tags field for each organization
        const orgsWithParsedTags = data.map((org: any) => ({
          ...org,
          tags:
            typeof org.tags === "string"
              ? JSON.parse(org.tags)
              : org.tags || [],
        }));
        setOrganizations(orgsWithParsedTags);
        setFilteredOrganizations(orgsWithParsedTags);
      } catch (error) {
        console.error("Error fetching organizations:", error);
      }
    };

    fetchOrganizations();
  }, []);

  return (
    <div className="p-4 sm:p-6 pt-14 sm:pt-16 pb-28 sm:pb-6 relative">
      {/* Desktop search component */}
      <div className="hidden sm:block">
        <DirectSearch
          onSearch={handleSearch}
          blurEnabled={blurEnabled}
          onToggleBlur={handleToggleBlur}
        />
      </div>

      <div className="w-full">
        {filteredOrganizations.length === 0 ? (
          <div className="text-center py-10">
            <h2 className="text-xl font-semibold text-gray-700">
              No organizations found
            </h2>
            <p className="mt-2 text-gray-500">
              Try adjusting your search terms
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6">
            {filteredOrganizations.map((organization) => (
              <div
                key={organization.id}
                className={`border overflow-hidden rounded-lg shadow-md transition-all duration-700 hover:scale-105 hover:z-10 hover:shadow-xl sm:hover:blur-0 bg-gradient-to-br ${organization.bgGradient} ${
                  spotlightId === organization.id &&
                  blurEnabled &&
                  !searchActive
                    ? "blur-0 scale-105 z-10 shadow-xl"
                    : !blurEnabled || searchActive
                      ? ""
                      : "sm:blur-sm"
                }`}
              >
                <Link href={`/charity/${organization.nickname}`}>
                  <div className="h-36 sm:h-48 overflow-hidden relative group">
                    <div className="relative size-full">
                      <Image
                        src={
                          organization.image ||
                          "https://images.unsplash.com/photo-1620778182530-703effa65a06?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGJ0Y3xlbnwwfHwwfHx8MA%3D%3D"
                        }
                        alt={organization.title}
                        fill
                        className={`object-cover bg-black contrast-125 transition-all duration-700 ease-in-out ${
                          (spotlightId === organization.id &&
                            blurEnabled &&
                            !searchActive) ||
                          !blurEnabled
                            ? "grayscale-0"
                            : "sm:grayscale grayscale-0"
                        } hover:grayscale-0`}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "https://images.unsplash.com/photo-1620778182530-703effa65a06?w=600&auto=format&fit=crop&q=60";
                        }}
                      />
                    </div>
                    <div
                      className={`absolute bottom-2 right-2 flex space-x-1 transition-opacity duration-300 ${
                        (spotlightId === organization.id &&
                          blurEnabled &&
                          !searchActive) ||
                        searchActive ||
                        !blurEnabled
                          ? "opacity-100"
                          : "opacity-100 sm:opacity-0"
                      } group-hover:opacity-100`}
                    >
                      {organization.verified && (
                        <span className="bg-primary/30 border backdrop-blur-md border-primary text-white text-xs px-2 py-1 rounded-bl-none rounded-tr-none rounded shadow-md">
                          Verified
                        </span>
                      )}
                      {organization.premium && (
                        <span className="bg-[#f7931a]/30 border border-[#f7931a] backdrop-blur-md text-white text-xs px-2 py-1 rounded-tl-none rounded-br-none rounded ">
                          Premium
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="p-3 sm:p-4">
                    <div className="flex justify-between items-start mb-1 sm:mb-2">
                      <h3 className="text-sm sm:text-lg font-bold dark:text-white text-black line-clamp-1">
                        {organization.title}
                      </h3>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3 line-clamp-2">
                      {organization.mission}
                    </p>
                    <div className="flex flex-wrap gap-1 justify-end">
                      {(organization.tags || []).slice(0, 2).map((tag, index) => (
                        <span
                          key={index}
                          className="bg-gray-200/20 dark:bg-white/20 dark:text-white dark:border-white border border-black dark:hover:border dark:hover:text-primary hover:bg-primary/20 hover:border-primary hover:text-primary dark:hover:border-primary text-gray-700 text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1"
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

      {/* Mobile search component - fixed at bottom unless searching */}
      <div className={`sm:hidden fixed ${isSearching ? 'top-0 pt-14' : 'bottom-0'} left-0 right-0 p-3 bg-background/80 backdrop-blur-xl border-t dark:border-gray-800 z-20 transition-all duration-300`}>
        <DirectSearch
          onSearch={handleSearch}
          blurEnabled={blurEnabled}
          onToggleBlur={handleToggleBlur}
        />
      </div>
    </div>
  );
};

export default Page;
