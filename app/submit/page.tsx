"use client";

import { Label } from "@radix-ui/react-label";
import { isCompanyEmail } from "company-email-validator";
import { useState, useEffect } from "react";
import { useCountries } from "use-react-countries";
import MarkdownEditor from "@/components/markdown";
import { Button } from "@/components/ui/button";

interface Country {
  id: string;
  name: string;
}

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
    state: "",
    tags: ["", "", ""],
    aWord: "",
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
            <div className="warning-box bg-primary/10 p-4 border border-primary rounded-lg mb-6">
              <p className="text-gray-600 dark:text-gray-200">
                Warning: A submission fee of $30 is required to process your
                application. This helps us develop and maintain{" "}
                <code className="text-primary rounded-none bg-muted-foreground/15 px-1.5 py-0.5">
                  Fund The World!
                </code>
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

              <div className="grid grid-cols-2 gap-4">
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
                    {countries.map((country: Country) => (
                      <option key={country.id} value={country.id}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="state">State/Province</Label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    className="w-full mt-1 bg-white/5 rounded border border-gray-600 p-2"
                    value={formData.state}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="orgPicture">Organization Picture</Label>
                <input
                  type="file"
                  id="orgPicture"
                  name="orgPicture"
                  className="w-full mt-1 bg-white/5 rounded border border-gray-600 p-2"
                  value={formData.orgPicture}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <Label htmlFor="orgBanner">Organization Banner</Label>
                <input
                  type="file"
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
                  placeholder="15 word catchline to introduce your project."
                />
              </div>

              <div>
                <Label htmlFor="businessContext" className="font-bold">
                  Business Context
                </Label>{" "}
                <span className="text-gray-400/50 dark:text-gray-200/50">
                  Please provide all the business context necessary for our
                  donators to be able to converse and question your work
                </span>
                <textarea
                  id="businessContext"
                  name="businessContext"
                  rows={4}
                  className="w-full mt-2 bg-white/5 rounded border border-gray-600 p-2"
                  value={formData.businessContext}
                  onChange={handleInputChange}
                  placeholder="Provide as much information as you'd like about your business..."
                />
              </div>

              <div>
                <Label>Custom Tags (Choose up to 3)</Label>
                <div className="grid grid-cols-3 gap-4 mt-2">
                  {formData.tags.map((tag, index) => (
                    <input
                      key={index}
                      type="text"
                      value={tag}
                      onChange={(e) => {
                        const newTags = [...formData.tags];
                        newTags[index] = e.target.value;
                        setFormData((prev) => ({ ...prev, tags: newTags }));
                      }}
                      className="w-full bg-white/5 rounded border border-gray-600 p-2"
                      placeholder={`Tag ${index + 1}`}
                    />
                  ))}
                </div>
                <div className="flex flex-wrap gap-1 mt-2 relative group">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/50 to-gray-900/80 group-hover:opacity-0 transition-opacity duration-300 ease-in-out pointer-events-none"></div>
                  {formData.tags.map(
                    (tag, index) =>
                      tag && (
                        <span
                          key={index}
                          className="bg-gray-200/20 dark:bg-white/20 dark:text-white dark:border-white border border-black dark:hover:border dark:hover:text-primary hover:bg-primary/20 hover:border-primary hover:text-primary dark:hover:border-primary text-gray-700 text-xs px-2 py-1"
                        >
                          {tag}
                        </span>
                      ),
                  )}
                </div>
              </div>

              <div>
                <span className="text-gray-400/50 dark:text-gray-200/50 block mb-4">
                  Please create a markdown format for your custom message to
                  your possible donators! As long or short as you&apos;d like
                </span>
                <MarkdownEditor
                  value={formData.aWord}
                  onChange={(value) =>
                    setFormData((prev) => ({ ...prev, aWord: value }))
                  }
                  label="A Word"
                  placeholder="Write your markdown message here... Use **bold**, *italic*, [links](url), and more!"
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
            <div className="w-full justify-center flex">
              <Button className="border-primary w-full" variant="outline">
                Submit
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
