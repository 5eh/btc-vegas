"use client";
import { Award, ExternalLink, Info, Mail, MapPin, Shield, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState, useLayoutEffect } from "react";
import { Markdown } from "@/components/custom/markdown";

interface Organization {
  id: string;
  image: string;
  title: string;
  mission: string;
  tags: string[];
  verified: boolean;
  premium: boolean;
  bgGradient: string;
  bitcoinAddress: string;
  location: string;
  fullContext: string;
  website: string;
  email: string;
  originDate: string;
  registrationNumber: string;
  president: string;
  founder: string;
  banner: string;
  nickname: string;
  customMessage: string;
  createdAt: string;
  updatedAt: string;
}

type ApiResponse = {
  data?: Organization;
  error?: string;
};

export default function CharityPage() {
  const params = useParams();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  
  // Check if device is mobile
  useLayoutEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    async function fetchOrganization() {
      try {
        if (!params.nickname || typeof params.nickname !== "string") {
          throw new Error("Invalid nickname parameter");
        }

        const response = await fetch(`/api/organization/${params.nickname}`);
        const contentType = response.headers.get("content-type");

        if (!contentType?.includes("application/json")) {
          throw new Error("Invalid server response format");
        }

        const result: ApiResponse = await response.json();

        if (!response.ok) {
          throw new Error(
            result.error || `HTTP error! status: ${response.status}`,
          );
        }

        if (!result.data) {
          throw new Error("Organization data is missing");
        }

        setOrganization(result.data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch organization:", err);
        setError(
          err instanceof Error ? err.message : "An unexpected error occurred",
        );
        setOrganization(null);
      } finally {
        setLoading(false);
      }
    }

    fetchOrganization();
  }, [params.nickname]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full size-12 border-y-2 border-blue-500 dark:border-blue-400"></div>
      </div>
    );
  }

  if (error || !organization) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <h1 className="text-2xl font-bold mb-4 dark:text-white">
          Charity Not Found
        </h1>
        <p className="mb-6 dark:text-gray-300">
          {error || "Organization not found"}
        </p>
        <Link
          href="/"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          aria-label="Return to organizations list"
        >
          Return to Organizations
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto mt-16 md:mt-20 px-4 md:px-6">
      <div className="h-64 sm:h-80 md:h-96 overflow-hidden relative rounded-lg">
        <Image
          src={organization!.banner}
          alt={`${organization!.title} banner`}
          width={1200}
          height={400}
          className="size-full object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
      </div>

      {/* Profile Section */}
      <div className="-mt-16 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center mb-4 sm:mb-0">
            {/* Logo */}
            <div className="size-24 sm:size-32 md:size-40 overflow-hidden bg-gray-800 rounded-lg border-4 border-background shadow-lg z-10">
              <img
                src={organization!.image}
                alt={organization!.title}
                className="size-full object-cover border border-primary"
              />
            </div>
            
            {/* Title and Badges */}
            <div className="flex-1 ml-4 sm:pt-0">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold dark:text-white mb-2">
                {organization!.title}
              </h1>
              <div className="flex space-x-2">
                {organization!.verified && (
                  <span className="bg-primary/30 backdrop-blur-xl border border-primary text-white text-xs px-2 py-1 rounded-full shadow-md">
                    Verified
                  </span>
                )}
                {organization!.premium && (
                  <span className="bg-[#f7931a]/30 backdrop-blur-xl border border-[#f7931a] text-white text-xs px-2 py-1 rounded-full shadow-md">
                    Premium
                  </span>
                )}
              </div>
            </div>
          </div>
          
          {/* Tags */}
          <div className="flex flex-wrap gap-2 justify-start sm:justify-end mt-4 sm:mt-0">
            {organization!.tags.slice(0, 5).map((tag, index) => (
              <span
                key={index}
                className="bg-gray-100/20 backdrop-blur-xl dark:bg-gray-700/30 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full text-xs border border-gray-200 dark:border-gray-600"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between p-4 bg-transparent backdrop-blur-3xl border border-gray-200 dark:border-gray-700 rounded-lg">
          <div className="break-all font-mono text-xs xs:text-sm dark:text-gray-300 mb-3 xs:mb-0 w-full xs:w-auto overflow-hidden overflow-ellipsis">
            {organization!.bitcoinAddress}
          </div>
          <div className="flex gap-2 w-full xs:w-auto xs:ml-4 justify-between xs:justify-end">
            <button
              className="flex-1 xs:flex-initial px-3 py-2 xs:py-1 bg-transparent backdrop-blur-xl border border-orange-500 text-orange-500 text-sm rounded-lg hover:bg-orange-500 hover:text-white transition-all"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(
                    organization!.bitcoinAddress,
                  );
                } catch (err) {
                  console.error("Failed to copy to clipboard:", err);
                }
              }}
            >
              Copy
            </button>
            <a
              href={`bitcoin:${organization!.bitcoinAddress}`}
              className="flex-1 xs:flex-initial text-center px-3 py-2 xs:py-1 bg-transparent backdrop-blur-xl border border-primary text-primary text-sm rounded-lg hover:bg-primary hover:text-white transition-all"
            >
              Open
            </a>
          </div>
        </div>

        {/* Two Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {/* Left Column - Mission and About */}
          <div className="space-y-6 md:space-y-8 order-2 md:order-1">
            <section className="bg-transparent backdrop-blur-xl border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6">
              <div className="flex items-center mb-4">
                <Info className="size-5 md:size-6 text-primary mr-2" />
                <h2 className="text-lg md:text-xl font-bold dark:text-white">
                  Our Mission
                </h2>
              </div>
              <p className="text-sm md:text-base text-gray-700 dark:text-gray-300">
                {organization!.mission}
              </p>
            </section>

            <section className="bg-transparent backdrop-blur-xl border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6">
              <div className="flex items-center mb-4">
                <Shield className="size-5 md:size-6 text-primary mr-2" />
                <h2 className="text-lg md:text-xl font-bold dark:text-white">About Us</h2>
              </div>
              <p className="text-sm md:text-base text-gray-700 dark:text-gray-300">
                {organization!.fullContext}
              </p>
            </section>
          </div>

          {/* Right Column - Charity Information */}
          <div className="bg-transparent backdrop-blur-xl border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 order-1 md:order-2">
            <h2 className="text-lg md:text-xl font-bold dark:text-white mb-4 flex items-center">
              <Info className="size-5 md:size-6 text-primary mr-2" />
              Organization Details
            </h2>
            
            <div className="grid grid-cols-1 gap-4">
              {/* Founded */}
              <div className="flex items-start">
                <ExternalLink className="size-5 text-primary mt-0.5 shrink-0" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium dark:text-white">Founded</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {new Date(organization!.originDate).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      },
                    )}
                  </p>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start">
                <MapPin className="size-5 text-primary mt-0.5 shrink-0" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium dark:text-white">Location</h3>
                  <p className="text-sm text-primary blur-sm hover:blur-0 transition-all duration-300">
                    {organization!.location}
                  </p>
                </div>
              </div>

              {/* Contact */}
              <div className="flex items-start">
                <Mail className="size-5 text-primary mt-0.5 shrink-0" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium dark:text-white">Contact</h3>
                  <a
                    href={`mailto:${organization!.email}`}
                    className="text-sm text-primary blur-sm hover:blur-0 transition-all duration-300"
                  >
                    {organization!.email}
                  </a>
                </div>
              </div>

              {/* Website */}
              <div className="flex items-start">
                <ExternalLink className="size-5 text-primary mt-0.5 shrink-0" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium dark:text-white">Website</h3>
                  <a
                    href={organization!.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary blur-sm hover:blur-0 transition-all duration-300"
                  >
                    {organization!.website.replace(/(^\w+:|^)\/\//, "")}
                  </a>
                </div>
              </div>

              {/* Registration */}
              <div className="flex items-start">
                <Award className="size-5 text-primary mt-0.5 shrink-0" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium dark:text-white">Registration</h3>
                  <p className="text-sm text-primary blur-sm hover:blur-0 transition-all duration-300">
                    {organization!.registrationNumber}
                  </p>
                </div>
              </div>

              {/* Leadership */}
              <div className="flex items-start">
                <Shield className="size-5 text-primary mt-0.5 shrink-0" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium dark:text-white">Leadership</h3>
                  <p className="text-sm text-primary blur-sm hover:blur-0 transition-all duration-300">
                    <span className="block">President: {organization!.president}</span>
                    <span className="block">Founder: {organization!.founder}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* A Word From Us Section */}
        <div className="mt-8 md:mt-12 bg-transparent backdrop-blur-xl border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-8">
          <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 dark:text-white flex items-center">
            <Info className="size-5 md:size-6 text-primary mr-2" />
            A Word From Us
          </h2>
          <div className="prose dark:prose-invert max-w-none prose-sm md:prose-base">
            {organization!.customMessage && (
              <div className="text-gray-700 dark:text-gray-300">
                <Markdown>{organization!.customMessage.replace(/\\n/g, '\n')}</Markdown>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
