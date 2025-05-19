import { convertToCoreMessages, Message, streamText } from "ai";
import { z } from "zod";
import { geminiProModel } from "@/ai";
import {
  findCharities,
  getCharityDetails,
  calculateDonation,
} from "@/ai/actions";
import { auth } from "@/app/(auth)/auth";
import {
  createReservation,
  deleteChatById,
  getChatById,
  getReservationById,
  saveChat,
} from "@/db/queries";
import { generateUUID } from "@/lib/utils";

export async function POST(request: Request) {
  const { id, messages }: { id: string; messages: Array<Message> } =
    await request.json();

  const session = await auth();

  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const coreMessages = convertToCoreMessages(messages).filter(
    (message) => message.content.length > 0,
  );

  const result = await streamText({
    model: geminiProModel,
    system: `\n
        - you are 'Fund The World', a platform that helps users discover and donate to charity organizations!
        - keep your responses limited to a sentence, unless the user wants a good understanding of a specific charity.
        - ONLY output lists if the user asks for information about a category of organizations.
        - today's date is ${new Date().toLocaleDateString()}.
        - ask follow up questions to nudge user into the optimal flow
        - ask for any details you don't know, etc.'
        - be knowledgeable and passionate about social impact and charitable causes
        - emphasize the concrete impact donations can make (e.g., "$10 provides 5 meals"), HOWEVER, be clear that this is an estimate.
        - highlight tax deduction benefits IF applicable, and IF the user wants that.
        - here's the optimal flow
          - search for charities based on user's interests/causes
          - provide charity details and impact information
          - calculate donation (ask user about donation amount, recurring options, and matching)
          - process donation (ask user whether to proceed with payment or modify donation)
          - provide donation receipt and impact summary after payment confirmation
        '
      `,
    messages: coreMessages,
    tools: {
      getWeather: {
        description: "Get the current weather at a location",
        parameters: z.object({
          latitude: z.number().describe("Latitude coordinate"),
          longitude: z.number().describe("Longitude coordinate"),
        }),
        execute: async ({ latitude, longitude }) => {
          const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m&hourly=temperature_2m&daily=sunrise,sunset&timezone=auto`,
          );

          const weatherData = await response.json();
          return weatherData;
        },
      },

      createDonation: {
        description: "Create a donation record in the database",
        parameters: z.object({
          charityId: z.string().describe("Unique identifier for the charity"),
          charityName: z.string().describe("Name of the charity"),
          donationAmountInUSD: z.number().describe("Donation amount in USD"),
          donationAmountInBTC: z.number().optional().describe("Donation amount in BTC"),
          bitcoinAddress: z.string().optional().describe("Bitcoin address for donation"),
          isRecurring: z
            .boolean()
            .describe("Whether this is a recurring donation"),
          recurringFrequency: z
            .string()
            .optional()
            .describe(
              "Frequency of recurring donation (e.g., monthly, quarterly, yearly)",
            ),
          donorName: z.string().describe("Name of the donor"),
          donorEmail: z
            .string()
            .optional()
            .describe("Email of the donor for receipt"),
        }),
        execute: async (props) => {
          const session = await auth();
          const id = generateUUID();

          if (session && session.user && session.user.id) {
            await createReservation({
              id,
              userId: session.user.id,
              details: { ...props },
            });

            return { id, ...props, success: true };
          } else {
            return {
              error: "User is not signed in to perform this action!",
            };
          }
        },
      },
      authorizePayment: {
        description:
          "User will enter credentials to authorize donation payment, wait for user to respond when they are done",
        parameters: z.object({
          donationId: z.string().describe("Unique identifier for the donation"),
          charityName: z.string().describe("Name of the charity receiving the donation"),
          bitcoinAddress: z.string().describe("Bitcoin address for donation"),
          donationAmount: z.number().describe("Amount of BTC to donate"),
          donationPurpose: z.string().describe("Purpose of the donation for QR code message"),
        }),
        execute: async ({ donationId, charityName, bitcoinAddress, donationAmount, donationPurpose }) => {
          return { 
            donationId, 
            charityName,
            bitcoinAddress,
            donationAmount,
            donationPurpose
          };
        },
      },
      verifyPayment: {
        description: "Verify donation payment status",
        parameters: z.object({
          donationId: z.string().describe("Unique identifier for the donation"),
        }),
        execute: async ({ donationId }) => {
          const donation = await getReservationById({ id: donationId });

          if (donation.hasCompletedPayment) {
            return { hasCompletedPayment: true };
          } else {
            return { hasCompletedPayment: false };
          }
        },
      },
      generateDonationReceipt: {
        description: "Generate a receipt for a completed donation",
        parameters: z.object({
          donationId: z.string().describe("Unique identifier for the donation"),
          donorName: z.string().describe("Name of the donor, in title case"),
          charityName: z.string().describe("Name of the charity"),
          donationAmountInUSD: z.number().describe("Donation amount in USD"),
          donationAmountInBTC: z.number().optional().describe("Donation amount in BTC if applicable"),
          donationDate: z.string().describe("ISO 8601 date of donation"),
          isRecurring: z
            .boolean()
            .describe("Whether this is a recurring donation"),
          estimatedImpact: z
            .string()
            .describe("Estimated impact of the donation"),
          bitcoinTxId: z
            .string()
            .optional()
            .describe("Bitcoin transaction ID if paid via Bitcoin"),
        }),
        execute: async (receiptDetails) => {
          return receiptDetails;
        },
      },
      searchCharities: {
        description: "Search for charities based on category and keywords",
        parameters: z.object({
          category: z
            .string()
            .describe(
              "Category of charity (e.g., Education, Health, Environment)",
            ),
          keywords: z
            .string()
            .describe("Keywords to narrow down charity search"),
        }),
        execute: async ({ category, keywords }) => {
          const results = await findCharities({
            category,
            keywords,
          });

          return results;
        },
      },
      getCharityInfo: {
        description: "Get detailed information about a specific charity",
        parameters: z.object({
          charityId: z.string().describe("Unique identifier for the charity"),
        }),
        execute: async ({ charityId }) => {
          const charityInfo = await getCharityDetails({
            charityId,
          });

          return charityInfo;
        },
      },
      processDonation: {
        description: "Calculate donation details including impact and receipt",
        parameters: z.object({
          charityId: z.string().describe("Unique identifier for the charity"),
          charityName: z.string().describe("Name of the charity"),
          donationAmountInUSD: z.number().describe("Donation amount in USD"),
          isRecurring: z
            .boolean()
            .describe("Whether this is a recurring donation"),
          recurringFrequency: z
            .string()
            .optional()
            .describe(
              "Frequency of recurring donation (e.g., monthly, quarterly, yearly)",
            ),
          donorName: z.string().describe("Name of the donor"),
          matchingEnabled: z
            .boolean()
            .describe("Whether to enable donation matching if available"),
          bitcoinPreferred: z
            .boolean()
            .optional()
            .describe("Whether the user prefers to donate with Bitcoin"),
        }),
        execute: async (props) => {
          const donationDetails = await calculateDonation(props);
          return donationDetails;
        },
      },
    },
    onFinish: async ({ responseMessages }) => {
      if (session.user && session.user.id) {
        try {
          await saveChat({
            id,
            messages: [...coreMessages, ...responseMessages],
            userId: session.user.id,
          });
        } catch (error) {
          console.error("Failed to save chat");
        }
      }
    },
    experimental_telemetry: {
      isEnabled: true,
      functionId: "stream-text",
    },
  });

  return result.toDataStreamResponse({});
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return new Response("Not Found", { status: 404 });
  }

  const session = await auth();

  if (!session || !session.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const chat = await getChatById({ id });

    if (chat.userId !== session.user.id) {
      return new Response("Unauthorized", { status: 401 });
    }

    await deleteChatById({ id });

    return new Response("Chat deleted", { status: 200 });
  } catch (error) {
    return new Response("An error occurred while processing your request", {
      status: 500,
    });
  }
}
