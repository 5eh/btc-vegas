"use client";
import { Award, ExternalLink, Info, Mail, MapPin, Shield } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import charities from "../../../db/charities.json";

interface Charity {
  id: number;
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
}

export default function CharityPage() {
  const params = useParams();
  const [charity, setCharity] = useState<Charity | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Find the charity with the matching nickname
    const nickname = params.nickname as string;
    const foundCharity = charities.find((c) => c.nickname === nickname);

    if (foundCharity) {
      setCharity(foundCharity as Charity);
    }

    setLoading(false);
  }, [params.nickname]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full size-12 border-y-2 border-blue-500 dark:border-blue-400"></div>
      </div>
    );
  }

  if (!charity) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <h1 className="text-2xl font-bold mb-4 dark:text-white">
          Charity Not Found
        </h1>
        <p className="mb-6 dark:text-gray-300">
          We couldn&apos;t find a charity with that name.
        </p>
        <Link
          href="/"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Return to Charities
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto mt-20">
      <div className="h-128 md:h-96 overflow-hidden relative">
        <Image
          src={charity.banner}
          alt={`${charity.title} banner`}
          width={1200}
          height={400}
          className="size-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
      </div>

      {/* Profile Section */}
      <div className=" -mt-16 mb-8">
        <div className="flex items-center justify-between">
          {/* Title and Badges */}
          <div className="flex-1 pt-24">
            <h1 className="text-3xl font-bold dark:text-white mb-2">
              {charity.title}
            </h1>
            <div className="flex space-x-2">
              {charity.verified && (
                <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full shadow-md">
                  Verified
                </span>
              )}
              {charity.premium && (
                <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full shadow-md">
                  Premium
                </span>
              )}
            </div>
          </div>

          <div className="size-32 md:size-40 overflow-hidden bg-gray-800 mx-4  z-50">
            <img
              src={charity.image}
              alt={charity.title}
              className="size-full object-cover border border-primary"
            />
            <div className="flex-1 flex pt-12 flex-wrap justify-end gap-2">
              {charity.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className=" space-y-8">
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="break-all font-mono text-sm dark:text-gray-300">
            {charity.bitcoinAddress}
          </div>
          <div className="flex gap-2 ml-4">
            <button
              className="px-3 py-1 bg-orange-500 text-white text-sm rounded-lg hover:bg-orange-600 transition-colors"
              onClick={() => {
                navigator.clipboard.writeText(charity.bitcoinAddress);
              }}
            >
              Copy
            </button>
            <a
              href={`bitcoin:${charity.bitcoinAddress}`}
              className="px-3 py-1 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
            >
              Open
            </a>
          </div>
        </div>

        {/* Two Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column - Mission and About */}
          <div className="space-y-8">
            <section>
              <div className="flex items-center mb-4">
                <Info className="size-6 text-primary mr-2" />
                <h2 className="text-xl font-bold dark:text-white">
                  Our Mission
                </h2>
              </div>
              <p className="text-gray-700 dark:text-gray-300">
                {charity.mission}
              </p>
            </section>

            <section>
              <div className="flex items-center mb-4">
                <Shield className="size-6 text-primary mr-2" />
                <h2 className="text-xl font-bold dark:text-white">About Us</h2>
              </div>
              <p className="text-gray-700 dark:text-gray-300">
                {charity.fullContext}
              </p>
            </section>
          </div>

          {/* Right Column - Charity Information */}
          <div className="space-y-4">
            {/* Founded */}
            <div className="flex items-start justify-end">
              <div className="text-right">
                <h3 className="font-medium dark:text-white">Founded</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  {new Date(charity.originDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <ExternalLink className="size-5 text-gray-600 dark:text-gray-400 ml-3 mt-0.5 shrink-0" />
            </div>

            {/* Location */}
            <div className="flex items-start justify-end">
              <div className="text-right">
                <h3 className="font-medium dark:text-white">Location</h3>
                <p className="text-primary blur-sm hover:transition ease-in-out hover:blur-0 hover:underline">
                  {charity.location}
                </p>
              </div>
              <MapPin className="size-5 text-gray-600 dark:text-gray-400 ml-3 mt-0.5 shrink-0" />
            </div>

            {/* Contact */}
            <div className="flex items-start justify-end">
              <div className="text-right">
                <h3 className="font-medium dark:text-white">Contact</h3>
                <a
                  href={`mailto:${charity.email}`}
                  className="text-primary blur-sm hover:transition ease-in-out hover:blur-0 "
                >
                  {charity.email}
                </a>
              </div>
              <Mail className="size-5 text-gray-600 dark:text-gray-400 ml-3 mt-0.5 shrink-0" />
            </div>

            {/* Website */}
            <div className="flex items-start justify-end">
              <div className="text-right">
                <h3 className="font-medium dark:text-white">Website</h3>
                <a
                  href={charity.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary blur-sm hover:transition ease-in-out hover:blur-0 hover:underline"
                >
                  {charity.website.replace(/(^\w+:|^)\/\//, "")}
                </a>
              </div>
              <ExternalLink className="size-5 text-gray-600 dark:text-gray-400 ml-3 mt-0.5 shrink-0" />
            </div>

            {/* Registration */}
            <div className="flex items-start justify-end">
              <div className="text-right">
                <h3 className="font-medium dark:text-white">Registration</h3>
                <p className="text-primary blur-sm hover:transition ease-in-out hover:blur-0 ">
                  {charity.registrationNumber}
                </p>
              </div>
              <Award className="size-5 text-gray-600 dark:text-gray-400 ml-3 mt-0.5 shrink-0" />
            </div>

            {/* Leadership */}
            <div className="flex items-start justify-end">
              <div className="text-right">
                <h3 className="font-medium dark:text-white">Leadership</h3>
                <p className="text-primary blur-sm hover:transition ease-in-out hover:blur-0 ">
                  President: {charity.president}
                  <br />
                  Founder: {charity.founder}
                </p>
              </div>
              <Award className="size-5 text-gray-600 dark:text-gray-400 ml-3 mt-0.5 shrink-0" />
            </div>
          </div>
        </div>

        {/* A Word From Us Section */}
        <div className="mt-12 bg-gray-50 dark:bg-gray-800 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-6 dark:text-white">
            A Word From Us
          </h2>
          <div className="prose dark:prose-invert max-w-none">
            {charity.customMessage && (
              <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {charity.customMessage}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
