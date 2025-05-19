"use client";

import { useState, useEffect } from "react";
import { Label } from "@radix-ui/react-label";
import { useCountries } from "use-react-countries";
import { isCompanyEmail } from "company-email-validator";

const Page = () => {
  const [isMounted, setIsMounted] = useState(false);
  const { countries } = useCountries();
  const [formData, setFormData] = useState({
    orgName: "",
    orgPicture: "",
    orgBanner: "",
    tagline: "",
    businessContext: "",
    email: "",
    country: "",
  });
  const [emailError, setEmailError] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "email") {
      setEmailError(
        !isCompanyEmail(value) ? "Please enter a valid company email" : "",
      );
    }
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="pt-16 min-h-screen flex justify-center">
      <div className="max-w-4xl w-full px-4">
        <div className="bg-white/5 rounded-lg p-8 backdrop-blur-sm">
          <h1 className="text-2xl font-bold mb-6 text-center">
            Organization Submission
          </h1>

          <div className="space-y-6">
            <div className="warning-box bg-yellow-500/10 p-4 rounded-lg mb-6">
              <p className="text-yellow-500">
                Warning: A submission fee of $30 is required to process your
                application. This helps us develop and maintain{" "}
                <code className="text-primary rounded-none bg-muted-foreground/15 px-1.5 py-0.5">
                  Fund The World
                </code>
                .
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="orgName">Organization Name</Label>
                <input
                  type="text"
                  id="orgName"
                  name="orgName"
                  className="w-full mt-1 bg-white/5 rounded border border-gray-600 p-2"
                  value={formData.orgName}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <Label htmlFor="email">Company Email</Label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full mt-1 bg-white/5 rounded border border-gray-600 p-2"
                  value={formData.email}
                  onChange={handleInputChange}
                />
                {emailError && (
                  <p className="text-red-500 text-sm mt-1">{emailError}</p>
                )}
              </div>

              <div>
                <Label htmlFor="country">Country</Label>
                <select
                  id="country"
                  name="country"
                  className="w-full mt-1 bg-white/5 rounded border border-gray-600 p-2"
                  value={formData.country}
                  onChange={handleInputChange}
                >
                  <option value="">Select a country</option>
                  {countries.map((country) => (
                    <option key={country.id} value={country.id}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="orgPicture">Organization Picture URL</Label>
                <input
                  type="url"
                  id="orgPicture"
                  name="orgPicture"
                  className="w-full mt-1 bg-white/5 rounded border border-gray-600 p-2"
                  value={formData.orgPicture}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <Label htmlFor="orgBanner">Organization Banner URL</Label>
                <input
                  type="url"
                  id="orgBanner"
                  name="orgBanner"
                  className="w-full mt-1 bg-white/5 rounded border border-gray-600 p-2"
                  value={formData.orgBanner}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <Label htmlFor="tagline">Tagline</Label>
                <input
                  type="text"
                  id="tagline"
                  name="tagline"
                  className="w-full mt-1 bg-white/5 rounded border border-gray-600 p-2"
                  value={formData.tagline}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <Label htmlFor="businessContext">Business Context</Label>
                <textarea
                  id="businessContext"
                  name="businessContext"
                  rows={4}
                  className="w-full mt-1 bg-white/5 rounded border border-gray-600 p-2"
                  value={formData.businessContext}
                  onChange={handleInputChange}
                  placeholder="Provide as much information as you'd like about your business..."
                />
              </div>
            </div>

            <div className="flex justify-center mt-8">
              {isMounted && (
                <iframe
                  src="https://nowpayments.io/embeds/payment-widget?iid=4426600256"
                  width="410"
                  height="696"
                  frameBorder="0"
                  scrolling="no"
                  style={{ overflowY: "hidden" }}
                >
                  Can&apos;t load widget
                </iframe>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
