"use client";
// @ts-ignore
import { BitcoinQR } from "@ibunker/bitcoin-react";
import { Attachment, ToolInvocation } from "ai";
import { motion } from "framer-motion";
import { ReactNode } from "react";
import { BotIcon, UserIcon } from "./icons";
import { Markdown } from "./markdown";
import { PreviewAttachment } from "./preview-attachment";
import "@ibunker/bitcoin-react/dist/index.css";

const CreateDonation = ({ donation }: { donation?: any }) => {
  if (!donation)
    return (
      <div className="w-full h-24 bg-gray-100 rounded-md animate-pulse"></div>
    );

  return (
    <div className="border rounded-md p-4 space-y-2">
      <h3 className="font-medium text-lg">Donation Summary</h3>
      <div className="grid grid-cols-2 gap-2 text-sm mb-4">
        <div>
          <span className="font-medium">Charity:</span> {donation.charityName}
        </div>
        <div>
          <span className="font-medium">Amount:</span> $
          {donation.donationAmountInUSD}
        </div>
        <div>
          <span className="font-medium">Donor:</span> {donation.donorName}
        </div>
        <div>
          <span className="font-medium">Recurring:</span>{" "}
          {donation.isRecurring ? donation.recurringFrequency || "Yes" : "No"}
        </div>
      </div>

      <div className="bg-blue-50 p-3 rounded-md mb-4">
        <div className="text-blue-800 font-medium mb-1">
          Ready to Make Your Impact
        </div>
        <p className="text-sm text-blue-700">
          Your donation will be processed securely. You can use Bitcoin for
          instant, secure payments.
        </p>
      </div>

      <div className="mt-2">
        <button className="bg-blue-500 text-white px-4 py-2 rounded-md w-full">
          Proceed to Payment
        </button>
      </div>
    </div>
  );
};

const SearchCharities = ({ results }: { results?: any }) => {
  if (!results)
    return (
      <div className="w-full h-24 bg-gray-100 rounded-md animate-pulse"></div>
    );

  return (
    <div className="border rounded-md p-4 space-y-3">
      <h3 className="font-medium text-lg">Charity Search Results</h3>
      <div className="grid gap-2">
        {results.charities?.map((charity: any) => (
          <div key={charity.id} className="border-t pt-2">
            <div className="font-medium">{charity.name}</div>
            <div className="text-sm text-gray-600">{charity.category}</div>
            <div className="text-sm">{charity.description}</div>
            <div className="flex justify-between mt-1">
              <span className="text-xs bg-primary/30 text-primary px-2 py-0.5 border-primary border">
                {charity.impactMetric}
              </span>
              <span className="text-xs">
                Min: ${charity.minimumDonationInUSD}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const CharityDetails = ({ charityInfo }: { charityInfo?: any }) => {
  if (!charityInfo)
    return (
      <div className="w-full h-36 bg-gray-100 rounded-md animate-pulse"></div>
    );

  return (
    <div className="border rounded-md p-4">
      <h3 className="font-medium text-lg">{charityInfo.name}</h3>
      <div className="text-sm text-gray-600">
        Founded: {charityInfo.founded}
      </div>
      <p className="my-2">{charityInfo.mission}</p>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <span className="font-medium">Location:</span>{" "}
          {charityInfo.location.headquarters}
        </div>
        <div>
          <span className="font-medium">Category:</span> {charityInfo.category}
        </div>
        <div>
          <span className="font-medium">Program Expenses:</span>{" "}
          {charityInfo.financials.programExpensePercentage}%
        </div>
        <div>
          <span className="font-medium">Tax Deductible:</span>{" "}
          {charityInfo.taxDeductible ? "Yes" : "No"}
        </div>
      </div>
    </div>
  );
};

const DonationCalculator = ({ donationDetails }: { donationDetails?: any }) => {
  if (!donationDetails)
    return (
      <div className="w-full h-24 bg-gray-100 rounded-md animate-pulse"></div>
    );

  return (
    <div className="border rounded-md p-4 space-y-2">
      <h3 className="font-medium text-lg">Donation Details</h3>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <span className="font-medium">Amount (USD):</span> $
          {donationDetails.totalDonationInUSD}
        </div>
        <div>
          <span className="font-medium">Amount (BTC):</span> ₿
          {donationDetails.totalDonationInBTC}
        </div>
        <div>
          <span className="font-medium">Transaction Fee:</span> $
          {donationDetails.transactionFeeInUSD}
        </div>
        <div>
          <span className="font-medium">Tax Deduction:</span> $
          {donationDetails.taxDeductionEstimateInUSD}
        </div>
        {donationDetails.matchingAmountInUSD > 0 && (
          <div className="col-span-2">
            <span className="font-medium">Matching Amount:</span> $
            {donationDetails.matchingAmountInUSD}
          </div>
        )}
      </div>
      <div className="mt-2 p-2 bg-green-50 text-green-800 rounded-md">
        <span className="font-medium">Impact:</span>{" "}
        {donationDetails.estimatedImpact}
      </div>

      {donationDetails.bitcoinAddress && (
        <div className="mt-4 border-t pt-4">
          <h4 className="font-medium mb-2">Quick Bitcoin Donation</h4>
          <BitcoinQR
            amount={donationDetails.totalDonationInBTC}
            bitcoinAddress={donationDetails.bitcoinAddress}
            message={donationDetails.donationPurpose || "Support this cause"}
            title="Direct Donation"
          />
        </div>
      )}
    </div>
  );
};

const PaymentAuth = ({ intent }: { intent?: any }) => {
  if (!intent)
    return (
      <div className="w-full h-24 bg-gray-100 rounded-md animate-pulse"></div>
    );

  return (
    <div className="border rounded-md p-4 space-y-2">
      <h3 className="font-medium text-lg">Make a Bitcoin Donation</h3>
      <div className="text-sm text-gray-600 mb-2">
        Scan the QR code below to complete your donation
      </div>
      <BitcoinQR
        amount={intent.donationAmount || 0.00001}
        bitcoinAddress={
          intent.bitcoinAddress || "bc1qljwyvtarj5mvtf85ch3fa042qmquuemqgfh3wg"
        }
        message={intent.donationPurpose || "Support this charitable cause"}
        title={intent.charityName || "Charity Donation"}
      />
    </div>
  );
};

const VerifyDonation = ({ result }: { result?: any }) => {
  if (!result)
    return (
      <div className="w-full h-16 bg-gray-100 rounded-md animate-pulse"></div>
    );

  return (
    <div className="border rounded-md p-4">
      <div
        className={`flex items-center ${result?.hasCompletedPayment ? "text-green-600" : "text-amber-600"}`}
      >
        <div
          className={`rounded-full size-6 mr-2 flex items-center justify-center ${result?.hasCompletedPayment ? "bg-green-100" : "bg-amber-100"}`}
        >
          {result?.hasCompletedPayment ? "✓" : "!"}
        </div>
        <span className="font-medium">
          {result?.hasCompletedPayment
            ? "Payment verified successfully"
            : "Payment pending verification"}
        </span>
      </div>
    </div>
  );
};

const DonationReceipt = ({ receipt }: { receipt?: any }) => {
  if (!receipt)
    return (
      <div className="w-full h-36 bg-gray-100 rounded-md animate-pulse"></div>
    );

  return (
    <div className="border rounded-md p-4 space-y-2">
      <div className="flex justify-between items-center">
        <h3 className="font-medium text-lg">Donation Receipt</h3>
        <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
          Tax Deductible
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <span className="font-medium">Receipt ID:</span> {receipt.donationId}
        </div>
        <div>
          <span className="font-medium">Date:</span>{" "}
          {new Date(receipt.donationDate).toLocaleDateString()}
        </div>
        <div>
          <span className="font-medium">Donor:</span> {receipt.donorName}
        </div>
        <div>
          <span className="font-medium">Charity:</span> {receipt.charityName}
        </div>
        <div>
          <span className="font-medium">Amount:</span> $
          {receipt.donationAmountInUSD}
        </div>
        <div>
          <span className="font-medium">Type:</span>{" "}
          {receipt.isRecurring ? "Recurring" : "One-time"}
        </div>
      </div>
      <div className="mt-2 p-2 bg-blue-50 text-blue-800 rounded-md">
        <span className="font-medium">Impact:</span> {receipt.estimatedImpact}
      </div>
      <div className="mt-2">
        <button className="border border-blue-500 text-blue-500 px-4 py-2 rounded-md w-full">
          Download Receipt PDF
        </button>
      </div>
    </div>
  );
};

export const Message = ({
  chatId,
  role,
  content,
  toolInvocations,
  attachments,
}: {
  chatId: string;
  role: string;
  content: string | ReactNode;
  toolInvocations: Array<ToolInvocation> | undefined;
  attachments?: Array<Attachment>;
}) => {
  return (
    <motion.div
      className={`flex flex-row gap-4 px-4 w-full md:w-[500px] md:px-0 first-of-type:pt-20`}
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <div className="size-[24px] border rounded-sm p-1 flex flex-col justify-center items-center shrink-0 text-zinc-500">
        {role === "assistant" ? <BotIcon /> : <UserIcon />}
      </div>

      <div className="flex flex-col gap-2 w-full">
        {content && typeof content === "string" && (
          <div className="text-zinc-800 dark:text-zinc-300 flex flex-col gap-4">
            <Markdown>{content}</Markdown>
          </div>
        )}

        {toolInvocations && (
          <div className="flex flex-col gap-4">
            {toolInvocations.map((toolInvocation) => {
              const { toolName, toolCallId, state } = toolInvocation;

              if (state === "result") {
                const { result } = toolInvocation;

                return (
                  <div key={toolCallId}>
                    {toolName === "searchCharities" ? (
                      <SearchCharities results={result} />
                    ) : toolName === "getCharityInfo" ? (
                      <CharityDetails charityInfo={result} />
                    ) : toolName === "processDonation" ? (
                      <DonationCalculator donationDetails={result} />
                    ) : toolName === "createDonation" ? (
                      Object.keys(result).includes("error") ? null : (
                        <CreateDonation donation={result} />
                      )
                    ) : toolName === "authorizePayment" ? (
                      <PaymentAuth intent={result} />
                    ) : toolName === "generateDonationReceipt" ? (
                      <DonationReceipt receipt={result} />
                    ) : toolName === "verifyPayment" ? (
                      <VerifyDonation result={result} />
                    ) : (
                      <div>{JSON.stringify(result, null, 2)}</div>
                    )}
                  </div>
                );
              } else {
                return (
                  <div key={toolCallId} className="skeleton">
                    {toolName === "searchCharities" ? (
                      <SearchCharities />
                    ) : toolName === "getCharityInfo" ? (
                      <CharityDetails />
                    ) : toolName === "processDonation" ? (
                      <DonationCalculator />
                    ) : toolName === "createDonation" ? (
                      <CreateDonation />
                    ) : toolName === "authorizePayment" ? (
                      <PaymentAuth />
                    ) : toolName === "generateDonationReceipt" ? (
                      <DonationReceipt />
                    ) : null}
                  </div>
                );
              }
            })}
          </div>
        )}

        {attachments && (
          <div className="flex flex-row gap-2">
            {attachments.map((attachment) => (
              <PreviewAttachment key={attachment.url} attachment={attachment} />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};
