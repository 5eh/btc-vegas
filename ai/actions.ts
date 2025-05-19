import { generateObject } from "ai";
import { z } from "zod";
import { geminiFlashModel } from ".";

export async function getCharityCategories() {
  const { object: categories } = await generateObject({
    model: geminiFlashModel,
    prompt: `Generate a list of common charity categories with descriptions`,
    output: "array",
    schema: z.object({
      id: z.string().describe("Unique identifier for the category"),
      name: z.string().describe("Name of the charity category"),
      description: z.string().describe("Brief description of the category"),
      popularCauses: z
        .array(z.string())
        .describe("Popular causes within this category"),
      iconName: z
        .string()
        .describe("Name of an icon that represents this category"),
    }),
  });

  return { categories };
}

export async function generateCharityRecommendations({
  userInterests,
  location,
  donationAmount,
}: {
  userInterests: string[];
  location?: string;
  donationAmount?: number;
}) {
  const { object: recommendations } = await generateObject({
    model: geminiFlashModel,
    prompt: `Recommend charities based on these user preferences: interests - ${userInterests.join(", ")}, location - ${location || "any"}, donation amount - ${donationAmount || "any"}`,
    output: "array",
    schema: z.object({
      id: z.string().describe("Unique identifier for the charity"),
      name: z.string().describe("Name of the charity organization"),
      category: z.string().describe("Primary category of the charity"),
      description: z
        .string()
        .describe(
          "Brief description of why this charity matches the user's preferences",
        ),
      matchScore: z
        .number()
        .describe(
          "Score from 1-100 indicating how well this charity matches the user's preferences",
        ),
      impactHighlight: z
        .string()
        .describe("Highlight of the potential impact of a donation"),
    }),
  });

  return { recommendations };
}

export async function getDonationImpactReport({
  charityId,
  donationAmountInUSD,
  timeframe,
}: {
  charityId: string;
  donationAmountInUSD: number;
  timeframe: string;
}) {
  const { object: impactReport } = await generateObject({
    model: geminiFlashModel,
    prompt: `Generate an impact report for a ${donationAmountInUSD} USD donation to charity ${charityId} over ${timeframe}`,
    schema: z.object({
      summary: z.string().describe("Summary of the donation's impact"),
      metrics: z.array(
        z.object({
          name: z.string().describe("Name of the impact metric"),
          value: z.string().describe("Quantified impact value"),
          description: z
            .string()
            .describe("Description of what this metric means"),
        }),
      ),
      timeline: z.array(
        z.object({
          milestone: z.string().describe("Description of an impact milestone"),
          timeframe: z.string().describe("When this impact will be achieved"),
        }),
      ),
      comparisons: z
        .array(z.string())
        .describe("Comparisons to help understand the impact scale"),
      sustainabilityScore: z
        .number()
        .describe(
          "Score from 1-100 indicating the sustainability of this impact",
        ),
    }),
  });

  return impactReport;
}

export async function findCharities({
  category,
  keywords,
}: {
  category: string;
  keywords: string;
}) {
  const { object: charitySearchResults } = await generateObject({
    model: geminiFlashModel,
    prompt: `Generate search results for charities in the ${category} category with focus on ${keywords}, limit to 4 results`,
    output: "array",
    schema: z.object({
      id: z.string().describe("Unique identifier for the charity"),
      name: z.string().describe("Name of the charity organization"),
      category: z
        .string()
        .describe(
          "Primary category of the charity (e.g., Education, Health, Environment)",
        ),
      description: z
        .string()
        .describe("Brief description of the charity's mission"),
      location: z.object({
        city: z.string().describe("City where the charity is based"),
        country: z.string().describe("Country where the charity is based"),
      }),
      impactMetric: z
        .string()
        .describe(
          "Primary impact metric (e.g., '100 meals per $50', '10 trees planted per $20')",
        ),
      matchingDonation: z
        .boolean()
        .describe("Whether this charity has matching donations available"),
      minimumDonationInUSD: z
        .number()
        .describe("Minimum suggested donation in US dollars"),
    }),
  });

  return { charities: charitySearchResults };
}

export async function getCharityDetails({ charityId }: { charityId: string }) {
  const { object: charityDetails } = await generateObject({
    model: geminiFlashModel,
    prompt: `Detailed information for charity with ID ${charityId}`,
    schema: z.object({
      id: z.string().describe("Unique identifier for the charity"),
      name: z.string().describe("Name of the charity organization"),
      founded: z.number().describe("Year the charity was founded"),
      mission: z.string().describe("The charity's mission statement"),
      category: z.string().describe("Primary category of charity"),
      subcategories: z
        .array(z.string())
        .describe("List of subcategories/focus areas"),
      location: z.object({
        headquarters: z.string().describe("City and country of headquarters"),
        operatingRegions: z
          .array(z.string())
          .describe("Regions where the charity operates"),
      }),
      financials: z.object({
        totalAnnualBudget: z
          .number()
          .describe("Annual operating budget in USD"),
        programExpensePercentage: z
          .number()
          .describe("Percentage of funds that go to programs"),
        adminExpensePercentage: z
          .number()
          .describe("Percentage of funds that go to administration"),
        fundraisingExpensePercentage: z
          .number()
          .describe("Percentage of funds that go to fundraising"),
      }),
      impactMetrics: z.array(
        z.object({
          description: z.string().describe("Description of impact metric"),
          value: z.string().describe("Quantified impact per dollar amount"),
        }),
      ),
      websiteUrl: z.string().describe("URL to the charity's website"),
      bitcoinAddress: z
        .string()
        .describe("Bitcoin address for direct donations"),
      taxDeductible: z
        .boolean()
        .describe("Whether donations are tax-deductible"),
    }),
  });

  return charityDetails;
}

export async function calculateDonation({
  charityId,
  charityName,
  donationAmountInUSD,
  isRecurring,
  recurringFrequency,
  donorName,
  matchingEnabled,
}: {
  charityId: string;
  charityName: string;
  donationAmountInUSD: number;
  isRecurring: boolean;
  recurringFrequency?: string;
  donorName: string;
  matchingEnabled: boolean;
}) {
  const { object: donationDetails } = await generateObject({
    model: geminiFlashModel,
    prompt: `Calculate donation details for the following parameters\n\n${JSON.stringify(
      {
        charityId,
        charityName,
        donationAmountInUSD,
        isRecurring,
        recurringFrequency,
        donorName,
        matchingEnabled,
      },
      null,
      2,
    )}`,
    schema: z.object({
      totalDonationInUSD: z
        .number()
        .describe("Total donation amount in US dollars"),
      totalDonationInBTC: z
        .number()
        .describe("Total donation amount converted to Bitcoin"),
      bitcoinAddress: z
        .string()
        .describe("Bitcoin address for receiving the donation"),
      donationPurpose: z
        .string()
        .describe("Purpose of the donation, suitable for QR code message"),
      estimatedImpact: z
        .string()
        .describe("Estimated impact description based on donation amount"),
      transactionFeeInUSD: z.number().describe("Transaction fee in US dollars"),
      taxDeductionEstimateInUSD: z
        .number()
        .describe("Estimated tax deduction amount in US dollars"),
      matchingAmountInUSD: z
        .number()
        .describe("Additional matching amount in US dollars, if applicable"),
      receiptId: z
        .string()
        .describe("Unique identifier for the donation receipt"),
    }),
  });

  return donationDetails;
}
