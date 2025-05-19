# Simplified Feature Implementation: Flight Helper to Charity Fund Helper

## Overview

This document outlines a streamlined approach to converting our flight booking assistant into a charity fund helper. We focus on creating a functional MVP first, with simpler implementations that can be enhanced later.

## Current System Analysis

The current application has:
- Chat interface with Gemini Pro AI integration
- Flight search, booking, and payment workflow
- Existing charities.json file with structured charity data
- Database with user, chat, and reservation tables

## Simplified Implementation Plan

### 1. Database Approach

Rather than creating new tables, we'll reuse the existing structure:

```typescript
// Reuse existing reservation table for donations
export async function createDonation({
  id,
  userId,
  details,
}: {
  id: string;
  userId: string;
  details: any;
}) {
  return await createReservation({
    id,
    userId,
    details,
  });
}

export async function getDonationById({ id }: { id: string }) {
  return await getReservationById({ id });
}

export async function updateDonation({
  id,
  hasCompletedPayment,
}: {
  id: string;
  hasCompletedPayment: boolean;
}) {
  return await updateReservation({
    id,
    hasCompletedPayment,
  });
}
```

For charity access, create simple functions:

```typescript
import charitiesData from './charities.json';

export async function getCharities({ query }: { query?: string }) {
  if (!query) {
    // Return featured charities if no query
    return charitiesData.slice(0, 5);
  }
  
  // Simple case-insensitive search
  const lowercaseQuery = query.toLowerCase();
  return charitiesData.filter(charity => 
    charity.title.toLowerCase().includes(lowercaseQuery) ||
    charity.mission.toLowerCase().includes(lowercaseQuery) ||
    charity.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  ).slice(0, 8);
}

export async function getCharityById({ id }: { id: number | string }) {
  return charitiesData.find(charity => charity.id.toString() === id.toString());
}
```

### 2. Simplified AI Actions

Replace flight-related actions with streamlined charity functions:

```typescript
import { generateObject } from "ai";
import { z } from "zod";
import charitiesData from '../db/charities.json';
import { geminiFlashModel } from ".";

export async function searchCharities({ query }: { query?: string }) {
  if (!query) {
    // Return featured charities if no query
    return { 
      charities: charitiesData.slice(0, 5).map(charity => ({
        id: charity.id,
        title: charity.title,
        mission: charity.mission,
        tags: charity.tags,
        location: charity.location,
        verified: charity.verified,
      }))
    };
  }
  
  // Simple case-insensitive search
  const lowercaseQuery = query.toLowerCase();
  const filteredCharities = charitiesData.filter(charity => 
    charity.title.toLowerCase().includes(lowercaseQuery) ||
    charity.mission.toLowerCase().includes(lowercaseQuery) ||
    charity.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
  
  return { 
    charities: filteredCharities.slice(0, 8).map(charity => ({
      id: charity.id,
      title: charity.title,
      mission: charity.mission,
      tags: charity.tags,
      location: charity.location,
      verified: charity.verified,
    }))
  };
}

export async function getCharityDetails({ charityId }: { charityId: number | string }) {
  // Find the charity in our database
  const charity = charitiesData.find(c => c.id.toString() === charityId.toString());
  return charity || null;
}

export async function generateDonationOptions({ charityId }: { charityId: number | string }) {
  // Simplified fixed donation options
  return { 
    options: [
      { amountUSD: 10, impact: "Provides initial support", tier: "Supporter" },
      { amountUSD: 25, impact: "Helps fund basic needs", tier: "Friend" },
      { amountUSD: 50, impact: "Makes a significant contribution", tier: "Advocate" },
      { amountUSD: 100, impact: "Creates substantial impact", tier: "Champion" },
      { amountUSD: 500, impact: "Drives major change", tier: "Benefactor" }
    ]
  };
}

export async function calculateDonationImpact({ charityId, amountUSD }: { charityId: number | string, amountUSD: number }) {
  // Get charity details
  const charity = await getCharityDetails({ charityId });
  
  // Simplified impact templates based on donation amount
  const impactTemplates = {
    'water': [
      { threshold: 10, impact: "Provides clean water to 2 people for a month" },
      { threshold: 50, impact: "Provides clean water to a family for 3 months" },
      { threshold: 100, impact: "Helps build water purification systems for a small community" }
    ],
    'education': [
      { threshold: 10, impact: "Provides school supplies for 1 child" },
      { threshold: 50, impact: "Provides textbooks for a classroom" },
      { threshold: 100, impact: "Supports a teacher's salary for a month" }
    ],
    'health': [
      { threshold: 10, impact: "Provides basic medical supplies" },
      { threshold: 50, impact: "Funds medicine for 5 patients" },
      { threshold: 100, impact: "Supports a health clinic for a day" }
    ],
    'default': [
      { threshold: 10, impact: "Makes a meaningful difference" },
      { threshold: 50, impact: "Creates substantial positive change" },
      { threshold: 100, impact: "Drives significant impact in communities" }
    ]
  };
  
  // Determine category from tags (simplified)
  const category = charity?.tags?.[0]?.toLowerCase() || 'default';
  const impactList = impactTemplates[category] || impactTemplates['default'];
  
  // Find applicable impact
  const relevantImpact = impactList
    .filter(item => amountUSD >= item.threshold)
    .pop() || impactList[0];
  
  return {
    summary: `Your $${amountUSD} donation to ${charity?.title || 'this charity'} makes a difference!`,
    impact: relevantImpact.impact,
    timeframe: "within the next few months"
  };
}

export async function calculateTaxDeduction({ amountUSD }: { amountUSD: number }) {
  // Simplified tax information - fixed rate
  return {
    estimatedDeduction: amountUSD,
    taxRate: 0.3, // 30% simplified rate
    disclaimer: "This is an estimate. Please consult with a tax professional for advice specific to your situation.",
    notes: "Many charitable donations are tax-deductible up to certain limits."
  };
}
```

### 3. Simplified Chat API Route

Update the route.ts file with a focused charity system prompt:

```typescript
// Update system prompt
system: `\n
  - you help users find and donate to charities!
  - keep your responses conversational but concise.
  - today's date is ${new Date().toLocaleDateString()}.
  - help users find charities based on their interests
  - guide them through the donation process
  - here's the optimal flow
    - search for charities (by keywords or causes)
    - provide charity details
    - present donation options
    - create donation
    - show mock payment instructions
    - provide donation receipt
  '
`,

// Updated tools
tools: {
  searchCharities: {
    description: "Search for charities",
    parameters: z.object({
      query: z.string().optional().describe("Search keyword"),
    }),
    execute: async ({ query }) => {
      const results = await searchCharities({ query });
      return results;
    },
  },
  
  getCharityDetails: {
    description: "Get detailed information about a specific charity",
    parameters: z.object({
      charityId: z.number().or(z.string()).describe("ID of the charity"),
    }),
    execute: async ({ charityId }) => {
      const details = await getCharityDetails({ charityId });
      return details;
    },
  },
  
  generateDonationOptions: {
    description: "Get suggested donation options",
    parameters: z.object({
      charityId: z.number().or(z.string()).describe("ID of the charity"),
    }),
    execute: async ({ charityId }) => {
      const options = await generateDonationOptions({ charityId });
      return options;
    },
  },
  
  calculateDonationImpact: {
    description: "Show the potential impact of a donation",
    parameters: z.object({
      charityId: z.number().or(z.string()).describe("ID of the charity"),
      amountUSD: z.number().describe("Amount in USD to donate"),
    }),
    execute: async ({ charityId, amountUSD }) => {
      const impact = await calculateDonationImpact({ charityId, amountUSD });
      return impact;
    },
  },
  
  calculateTaxDeduction: {
    description: "Calculate potential tax benefits",
    parameters: z.object({
      amountUSD: z.number().describe("Donation amount in USD"),
    }),
    execute: async ({ amountUSD }) => {
      const taxBenefits = await calculateTaxDeduction({ amountUSD });
      return taxBenefits;
    },
  },
  
  initiateCharityDonation: {
    description: "Prepare a donation to a charity",
    parameters: z.object({
      charityId: z.number().or(z.string()).describe("ID of the charity"),
      amountUSD: z.number().describe("Amount in USD to donate"),
      donorName: z.string().describe("Name of the donor"),
      anonymous: z.boolean().describe("Whether the donation should be anonymous"),
    }),
    execute: async (props) => {
      const session = await auth();
      const id = generateUUID();

      if (session && session.user && session.user.id) {
        // Get charity details
        const charity = await getCharityDetails({ charityId: props.charityId });
        
        await createDonation({
          id,
          userId: session.user.id,
          details: { 
            ...props,
            charityName: charity.title,
            charityBitcoinAddress: charity.bitcoinAddress,
            timestamp: new Date().toISOString()
          },
        });

        return { 
          id, 
          ...props,
          charityName: charity.title,
          charityBitcoinAddress: charity.bitcoinAddress,
        };
      } else {
        return {
          error: "User is not signed in to perform this action!",
        };
      }
    },
  },
  
  authorizePayment: {
    description: "Display Bitcoin payment instructions (mock)",
    parameters: z.object({
      donationId: z.string().describe("Unique identifier for the donation"),
    }),
    execute: async ({ donationId }) => {
      const donation = await getDonationById({ id: donationId });
      const details = JSON.parse(donation.details);
      
      // Mock fixed conversion rate instead of using real-time data
      const estimatedBTC = (details.amountUSD * 0.000034).toFixed(8);
      
      return { 
        donationId,
        bitcoinAddress: details.charityBitcoinAddress,
        amountUSD: details.amountUSD,
        estimatedBTC,
        charityName: details.charityName,
        notes: "This is a mock implementation. In production, this would connect to real Bitcoin payment systems."
      };
    },
  },
  
  verifyPayment: {
    description: "Verify Bitcoin payment (mock implementation)",
    parameters: z.object({
      donationId: z.string().describe("Unique identifier for the donation"),
      transactionId: z.string().optional().describe("Bitcoin transaction ID")
    }),
    execute: async ({ donationId, transactionId }) => {
      // Simplified mock implementation - any transaction ID is accepted
      if (transactionId) {
        await updateDonation({
          id: donationId,
          hasCompletedPayment: true,
        });
        
        return { 
          hasCompletedPayment: true,
          message: "Payment confirmed. Thank you for your donation!"
        };
      }
      
      return { 
        hasCompletedPayment: false,
        message: "Waiting for payment confirmation"
      };
    },
  },
  
  generateDonationReceipt: {
    description: "Generate a donation receipt",
    parameters: z.object({
      donationId: z.string().describe("Unique identifier for the donation"),
    }),
    execute: async ({ donationId }) => {
      const donation = await getDonationById({ id: donationId });
      const details = JSON.parse(donation.details);
      
      return {
        donorName: details.donorName,
        charityName: details.charityName,
        amountUSD: details.amountUSD,
        timestamp: details.timestamp || new Date().toISOString(),
        transactionId: details.transactionId || "mock-transaction-id",
        taxDeductible: true,
        receiptId: donationId.substring(0, 8).toUpperCase(),
        notes: "This is a mock receipt for demonstration purposes."
      };
    },
  },
}
```

### 4. Simplified Bitcoin Payment Implementation

For the MVP, we'll use a mock implementation with fixed values:

- Display charity's Bitcoin address from charities.json
- Use fixed conversion rate for USD to BTC (no API calls)
- Accept any transaction ID for verification
- Store payment status in the database

This eliminates the need for:
- Real-time BTC price conversion APIs
- Blockchain verification endpoints
- Complex payment processing logic

### 5. Simplified Frontend Components

Create minimal components for the essential user flow:

1. **CharityList**: Simple grid of charity cards
   ```jsx
   const CharityList = ({ charities, onSelect }) => (
     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
       {charities.map(charity => (
         <div 
           key={charity.id}
           className="border rounded-lg p-4 cursor-pointer"
           onClick={() => onSelect(charity.id)}
         >
           <h3 className="font-bold">{charity.title}</h3>
           <p className="text-sm text-gray-600">{charity.mission.substring(0, 100)}...</p>
         </div>
       ))}
     </div>
   );
   ```

2. **DonationForm**: Basic form for donation amount
   ```jsx
   const DonationForm = ({ options, onDonate }) => (
     <div className="space-y-4">
       <h3 className="font-bold">Select donation amount</h3>
       <div className="space-y-2">
         {options.map(option => (
           <button 
             key={option.amountUSD}
             className="block w-full p-3 border rounded text-left"
             onClick={() => onDonate(option.amountUSD)}
           >
             ${option.amountUSD} - {option.tier} - {option.impact}
           </button>
         ))}
       </div>
     </div>
   );
   ```

3. **PaymentInstructions**: Display Bitcoin address
   ```jsx
   const PaymentInstructions = ({ 
     bitcoinAddress, 
     amountUSD, 
     estimatedBTC,
     onVerify 
   }) => {
     const [txid, setTxid] = useState('');
     
     return (
       <div className="space-y-4 border rounded-lg p-4">
         <h3 className="font-bold">Payment Instructions</h3>
         <p>Please send {estimatedBTC} BTC (${amountUSD}) to:</p>
         <div className="p-3 bg-gray-100 font-mono break-all">
           {bitcoinAddress}
         </div>
         <div className="space-y-2">
           <p>After sending, enter your transaction ID:</p>
           <input
             value={txid}
             onChange={e => setTxid(e.target.value)}
             className="border p-2 w-full"
             placeholder="Transaction ID"
           />
           <button 
             className="p-2 bg-blue-500 text-white rounded"
             onClick={() => onVerify(txid)}
           >
             Verify Payment
           </button>
         </div>
       </div>
     );
   };
   ```

## Testing Plan

1. **Basic Testing**:
   - Test the chat flow with different charity searches
   - Verify charity details display correctly
   - Test donation flow with mock transactions

2. **Data Verification**:
   - Ensure all charities from the JSON file are accessible
   - Verify Bitcoin addresses are properly displayed

## Rollout Strategy

1. **Phase 1: MVP Implementation** (Current Plan)
   - Implement core charity search and mock donation flow
   - Test thoroughly with internal team
   - Deploy to production with clear "Beta" indicators

2. **Phase 2: Future Enhancements** (Later)
   - Add real-time BTC conversion rates
   - Implement actual blockchain verification
   - Create more sophisticated impact calculations
   - Add social sharing features

## Future Enhancements

Save for later implementation:

1. **Real Bitcoin Integration**:
   - Connect to blockchain APIs for transaction verification
   - Real-time BTC/USD conversion rates
   - Bitcoin QR code generation

2. **Advanced Charity Features**:
   - Recurring donations
   - Donation matching campaigns
   - Impact tracking dashboards

3. **User Experience**:
   - Personalized charity recommendations
   - Donation history and tax reporting