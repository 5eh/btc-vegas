import { generateObject } from "ai";
import { z } from "zod";

import { geminiFlashModel } from ".";

export async function generateSampleFlightStatus({
  flightNumber,
  date,
}: {
  flightNumber: string;
  date: string;
}) {
  const { object: flightStatus } = await generateObject({
    model: geminiFlashModel,
    prompt: `Flight status for flight number ${flightNumber} on ${date}`,
    schema: z.object({
      flightNumber: z.string().describe("Flight number, e.g., BA123, AA31"),
      departure: z.object({
        cityName: z.string().describe("Name of the departure city"),
        airportCode: z.string().describe("IATA code of the departure airport"),
        airportName: z.string().describe("Full name of the departure airport"),
        timestamp: z.string().describe("ISO 8601 departure date and time"),
        terminal: z.string().describe("Departure terminal"),
        gate: z.string().describe("Departure gate"),
      }),
      arrival: z.object({
        cityName: z.string().describe("Name of the arrival city"),
        airportCode: z.string().describe("IATA code of the arrival airport"),
        airportName: z.string().describe("Full name of the arrival airport"),
        timestamp: z.string().describe("ISO 8601 arrival date and time"),
        terminal: z.string().describe("Arrival terminal"),
        gate: z.string().describe("Arrival gate"),
      }),
      totalDistanceInMiles: z
        .number()
        .describe("Total flight distance in miles"),
    }),
  });

  return flightStatus;
}

export async function generateSampleFlightSearchResults({
  origin,
  destination,
}: {
  origin: string;
  destination: string;
}) {
  const { object: flightSearchResults } = await generateObject({
    model: geminiFlashModel,
    prompt: `Generate search results for flights from ${origin} to ${destination}, limit to 4 results`,
    output: "array",
    schema: z.object({
      id: z
        .string()
        .describe("Unique identifier for the flight, like BA123, AA31, etc."),
      departure: z.object({
        cityName: z.string().describe("Name of the departure city"),
        airportCode: z.string().describe("IATA code of the departure airport"),
        timestamp: z.string().describe("ISO 8601 departure date and time"),
      }),
      arrival: z.object({
        cityName: z.string().describe("Name of the arrival city"),
        airportCode: z.string().describe("IATA code of the arrival airport"),
        timestamp: z.string().describe("ISO 8601 arrival date and time"),
      }),
      airlines: z.array(
        z.string().describe("Airline names, e.g., American Airlines, Emirates"),
      ),
      priceInUSD: z.number().describe("Flight price in US dollars"),
      numberOfStops: z.number().describe("Number of stops during the flight"),
    }),
  });

  return { flights: flightSearchResults };
}

export async function generateSampleSeatSelection({
  flightNumber,
}: {
  flightNumber: string;
}) {
  const { object: rows } = await generateObject({
    model: geminiFlashModel,
    prompt: `Simulate available seats for flight number ${flightNumber}, 6 seats on each row and 5 rows in total, adjust pricing based on location of seat`,
    output: "array",
    schema: z.array(
      z.object({
        seatNumber: z.string().describe("Seat identifier, e.g., 12A, 15C"),
        priceInUSD: z
          .number()
          .describe("Seat price in US dollars, less than $99"),
        isAvailable: z
          .boolean()
          .describe("Whether the seat is available for booking"),
      }),
    ),
  });

  return { seats: rows };
}

export async function generateReservationPrice(props: {
  seats: string[];
  flightNumber: string;
  departure: {
    cityName: string;
    airportCode: string;
    timestamp: string;
    gate: string;
    terminal: string;
  };
  arrival: {
    cityName: string;
    airportCode: string;
    timestamp: string;
    gate: string;
    terminal: string;
  };
  passengerName: string;
}) {
  const { object: reservation } = await generateObject({
    model: geminiFlashModel,
    prompt: `Generate price for the following reservation \n\n ${JSON.stringify(props, null, 2)}`,
    // Add function to convert BTC price to USD
    schema: z.object({
      totalPriceInUSD: z
        .number()
        .describe("Total reservation price in US dollars"),
    }),
  });

  return reservation;
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
