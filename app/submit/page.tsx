"use client";

import { Label } from "@radix-ui/react-label";
import { isCompanyEmail } from "company-email-validator";
import { useState, useEffect } from "react";
import { useCountries } from "use-react-countries";
import MarkdownEditor from "@/components/markdown";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, ChevronRight } from "lucide-react";

const steps = [
  { id: 1, name: "Basic Information" },
  { id: 2, name: "Organization Details" },
  { id: 3, name: "Media & Tags" },
  { id: 4, name: "Leadership & Contact" },
  { id: 5, name: "Review & Submit" },
];

interface FormData {
  nickname: string;
  image: string;
  title: string;
  banner: string;
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
  startDate: string;
  registrationNumber: string;
  president: string;
  founder: string;
  customMessage: string;
}

const Page = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isMounted, setIsMounted] = useState(false);
  const { countries } = useCountries();
  const [emailError, setEmailError] = useState("");
  const [formData, setFormData] = useState<FormData>({
    nickname: "Watson",
    image:
      "https://images.unsplash.com/photo-1747599309107-20504ba6b8dd?q=80&w=2676&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Walter Ego Organization",
    banner:
      "https://images.unsplash.com/photo-1747599309107-20504ba6b8dd?q=80&w=2676&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    mission: "Sex, Drugs, Rock n Roll",
    tags: ["hello", "goodbye", "howdy?"],
    verified: false,
    premium: true,
    bgGradient: "from-red-300 to-blue-400",
    bitcoinAddress: "1FfmbHfnpaZjKFvyi1okTjJJusN455paPH",
    location: "Omaha, Nebraska",
    fullContext: "Business busiess business!",
    website: "https://arthurlabs.net",
    email: "watson@arthurlabs.net",
    startDate: "",
    registrationNumber: "FEna9bea8",
    president: "Watson Lewis-Rodriguez",
    founder: "Watson Lewis-Rodriguez",
    customMessage: "Hello",
  });

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

  const handleSubmit = async () => {
    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit organization");
      }

      // Handle success (redirect or show success message)
    } catch (error) {
      console.error("Submission error:", error);
      // Handle error (show error message)
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Organization Name</Label>
              <input
                type="text"
                id="title"
                name="title"
                className="w-full mt-1 bg-white/5 rounded border border-gray-600 p-2"
                value={formData.title}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="nickname">Nickname (URL Identifier)</Label>
              <input
                type="text"
                id="nickname"
                name="nickname"
                className="w-full mt-1 bg-white/5 rounded border border-gray-600 p-2"
                value={formData.nickname}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="mission">Mission Statement</Label>
              <textarea
                id="mission"
                name="mission"
                rows={4}
                className="w-full mt-1 bg-white/5 rounded border border-gray-600 p-2"
                value={formData.mission}
                onChange={handleInputChange}
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="fullContext">Full Organization Context</Label>
              <textarea
                id="fullContext"
                name="fullContext"
                rows={6}
                className="w-full mt-1 bg-white/5 rounded border border-gray-600 p-2"
                value={formData.fullContext}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="bitcoinAddress">Bitcoin Address</Label>
              <input
                type="text"
                id="bitcoinAddress"
                name="bitcoinAddress"
                className="w-full mt-1 bg-white/5 rounded border border-gray-600 p-2"
                value={formData.bitcoinAddress}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <input
                type="text"
                id="location"
                name="location"
                className="w-full mt-1 bg-white/5 rounded border border-gray-600 p-2"
                value={formData.location}
                onChange={handleInputChange}
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="image">Organization Logo</Label>
              <input
                type="file"
                id="image"
                name="image"
                className="w-full mt-1 bg-white/5 rounded border border-gray-600 p-2"
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="banner">Banner Image</Label>
              <input
                type="file"
                id="banner"
                name="banner"
                className="w-full mt-1 bg-white/5 rounded border border-gray-600 p-2"
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="bgGradient">Background Gradient</Label>
              <input
                type="text"
                id="bgGradient"
                name="bgGradient"
                className="w-full mt-1 bg-white/5 rounded border border-gray-600 p-2"
                value={formData.bgGradient}
                onChange={handleInputChange}
                placeholder="e.g., linear-gradient(to right, #00ff87, #60efff)"
              />
            </div>
            <div>
              <Label>Tags (comma-separated)</Label>
              <input
                type="text"
                id="tags"
                name="tags"
                className="w-full mt-1 bg-white/5 rounded border border-gray-600 p-2"
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    tags: e.target.value.split(",").map((tag) => tag.trim()),
                  }))
                }
                placeholder="education, children, healthcare"
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Contact Email</Label>
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
              <Label htmlFor="website">Website</Label>
              <input
                type="url"
                id="website"
                name="website"
                className="w-full mt-1 bg-white/5 rounded border border-gray-600 p-2"
                value={formData.website}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="president">President</Label>
              <input
                type="text"
                id="president"
                name="president"
                className="w-full mt-1 bg-white/5 rounded border border-gray-600 p-2"
                value={formData.president}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="founder">Founder</Label>
              <input
                type="text"
                id="founder"
                name="founder"
                className="w-full mt-1 bg-white/5 rounded border border-gray-600 p-2"
                value={formData.founder}
                onChange={handleInputChange}
              />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <div>
              <Label>Custom Message to Donors</Label>
              <MarkdownEditor
                value={formData.customMessage}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, customMessage: value }))
                }
                label="Your Message"
                placeholder="Write your markdown message here..."
              />
            </div>
            <div className="mt-8">
              <h3 className="font-semibold mb-4">Review Your Information</h3>
              <pre className="bg-white/5 p-4 rounded-lg overflow-auto">
                {JSON.stringify(formData, null, 2)}
              </pre>
            </div>
          </div>
        );

      default:
        return null;
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

          {/* Stepper */}
          <div className="mb-8">
            <div className="flex items-center justify-between relative">
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className={cn(
                    "flex items-center",
                    index !== steps.length - 1 && "flex-1",
                  )}
                >
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center border-2",
                      currentStep > step.id
                        ? "bg-primary border-primary text-white"
                        : currentStep === step.id
                          ? "border-primary text-primary"
                          : "border-gray-600 text-gray-600",
                    )}
                  >
                    {currentStep > step.id ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      step.id
                    )}
                  </div>
                  {index !== steps.length - 1 && (
                    <div
                      className={cn(
                        "h-0.5 w-full mx-4",
                        currentStep > step.id ? "bg-primary" : "bg-gray-600",
                      )}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2">
              {steps.map((step) => (
                <div
                  key={step.id}
                  className={cn(
                    "text-xs",
                    currentStep >= step.id ? "text-primary" : "text-gray-600",
                  )}
                >
                  {step.name}
                </div>
              ))}
            </div>
          </div>

          {/* Form Content */}
          {renderStepContent()}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={() => setCurrentStep((prev) => prev - 1)}
              disabled={currentStep === 1}
            >
              Previous
            </Button>
            <Button
              onClick={() => {
                if (currentStep === steps.length) {
                  handleSubmit();
                } else {
                  setCurrentStep((prev) => prev + 1);
                }
              }}
            >
              {currentStep === steps.length ? "Submit" : "Next"}
              {currentStep !== steps.length && (
                <ChevronRight className="ml-2 h-4 w-4" />
              )}
            </Button>
          </div>

          {currentStep === steps.length && (
            <div className="flex justify-center mt-8">
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
