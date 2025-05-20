import { NextRequest, NextResponse } from "next/server";
import { createOrganization } from "@/db/queries";

export const dynamic = "force-dynamic";

interface OrganizationSubmission {
  nickname: string;
  image: string;
  title: string;
  banner: string;
  mission: string;
  tags: string[];
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
  verified: boolean;
  premium: boolean;
}

export async function POST(request: NextRequest) {
  try {
    if (!request.body) {
      return NextResponse.json(
        { error: "Request body is required" },
        { status: 400 },
      );
    }

    const data: OrganizationSubmission = await request.json();

    // Basic validation
    if (!data.title || !data.email || !data.bitcoinAddress) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 },
      );
    }

    // Validate bitcoin address format (basic check)
    const bitcoinRegex = /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/;
    if (!bitcoinRegex.test(data.bitcoinAddress)) {
      return NextResponse.json(
        { error: "Invalid Bitcoin address format" },
        { status: 400 },
      );
    }

    const result = await createOrganization({
      ...data,
    });

    return NextResponse.json(
      { message: "Organization created successfully", data: result },
      { status: 201 },
    );
  } catch (error) {
    console.error("Failed to create organization:", error);
    return NextResponse.json(
      { error: "Failed to create organization" },
      { status: 500 },
    );
  }
}
