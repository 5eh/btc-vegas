"use client";
// @ts-ignore
import { BitcoinQR } from "@ibunker/bitcoin-react";
import { Attachment, ToolInvocation } from "ai";
import { motion } from "framer-motion";
import Image from "next/image";
import { ReactNode } from "react";
import { BotIcon, UserIcon } from "./icons";
import { Markdown } from "./markdown";
import { PreviewAttachment } from "./preview-attachment";
import "@ibunker/bitcoin-react/dist/index.css";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1620778182530-703effa65a06?w=600&auto=format&fit=crop&q=60";

const CreateDonation = ({ donation }: { donation?: any }) => {
  if (!donation)
    return (
      <div className="w-full h-24 bg-muted rounded-md animate-pulse"></div>
    );

  return (
    <div className="border border-border rounded-md p-4 space-y-2">
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

      <div className="bg-primary/10 border border-primary/20 p-3 rounded-md mb-4">
        <div className="text-primary font-medium mb-1">
          Ready to Make Your Impact
        </div>
        <p className="text-sm text-muted-foreground">
          Your donation will be processed securely. You can use Bitcoin for
          instant, secure payments.
        </p>
      </div>

      <div className="mt-2">
        <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md w-full hover:bg-primary/90 transition-colors">
          Proceed to Payment
        </button>
      </div>
    </div>
  );
};

const OrganizationList = ({ organizations }: { organizations?: any }) => {
  if (!organizations)
    return (
      <div className="w-full h-24 bg-muted rounded-md animate-pulse"></div>
    );

  return (
    <div className="border border-border rounded-md p-4 space-y-3">
      <h3 className="font-medium text-lg">Available Organizations</h3>
      <div className="grid gap-4">
        {organizations.organizations?.map((org: any) => {
          const tags = Array.isArray(org.tags)
            ? org.tags
            : typeof org.tags === "string"
              ? JSON.parse(org.tags)
              : [];

          return (
            <div key={org.id} className="border border-border rounded-lg p-3">
              <div className="flex items-center gap-3">
                {org.image && (
                  <img
                    src={org.image}
                    alt={org.title}
                    className="size-10 rounded-full"
                  />
                )}
                <div>
                  <div className="font-medium flex items-center gap-2">
                    {org.title}
                    {org.verified && <span className="text-primary">✓</span>}
                    {org.premium && <span className="text-amber-500">★</span>}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {org.nickname}
                  </div>
                </div>
              </div>
              <div className="text-sm mt-2">{org.mission}</div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {tags.slice(0, 3).map((tag: string, index: number) => (
                    <span
                      key={index}
                      className="bg-muted border border-border text-muted-foreground text-xs px-2 py-1"
                    >
                      {tag}
                    </span>
                  ))}
                  {tags.length > 3 && (
                    <span className="text-xs text-muted-foreground">
                      +{tags.length - 3} more
                    </span>
                  )}
                </div>
              )}
              {org.location && (
                <div className="text-xs text-muted-foreground mt-2">
                  📍 {org.location}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const SearchCharities = ({ results }: { results?: any }) => {
  if (!results)
    return (
      <div className="w-full h-24 bg-muted rounded-md animate-pulse"></div>
    );

  return (
    <div className="border border-border rounded-md p-4 space-y-3">
      <h3 className="font-medium text-lg">Charity Search Results</h3>
      {results.note && (
        <p className="text-sm text-muted-foreground">{results.note}</p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {results.charities?.map((charity: any) => (
          <div
            key={charity.id}
            className="border border-border overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-all duration-300 bg-card"
          >
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-base font-bold">{charity.name}</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                {charity.mission || charity.description}
              </p>
              {charity.location && (
                <div className="text-xs text-muted-foreground mb-2">
                  📍 {charity.location}
                </div>
              )}
              <div className="flex flex-wrap gap-1 justify-end">
                {(charity.tags || []).slice(0, 3).map((tag: string, index: number) => (
                  <span
                    key={index}
                    className="bg-muted border border-border text-muted-foreground text-xs px-2 py-1"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-2 mt-2">
                {charity.verified && (
                  <span className="bg-primary/20 border border-primary text-primary text-xs px-2 py-0.5 rounded">
                    Verified
                  </span>
                )}
                {charity.premium && (
                  <span className="bg-amber-500/20 border border-amber-500 text-amber-500 text-xs px-2 py-0.5 rounded">
                    Premium
                  </span>
                )}
              </div>
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
      <div className="w-full h-36 bg-muted rounded-md animate-pulse"></div>
    );

  const tags = Array.isArray(charityInfo.tags)
    ? charityInfo.tags
    : typeof charityInfo.tags === "string"
      ? JSON.parse(charityInfo.tags)
      : [];

  return (
    <div className="border border-border rounded-md overflow-hidden shadow-md bg-card">
      {(charityInfo.banner || charityInfo.image) && (
        <div className="h-48 relative">
          <Image
            src={charityInfo.banner || charityInfo.image || FALLBACK_IMAGE}
            alt={charityInfo.name || charityInfo.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-4 flex items-center gap-3">
            {charityInfo.image && (
              <div className="size-16 rounded-full overflow-hidden border-2 border-white relative">
                <Image
                  src={charityInfo.image || FALLBACK_IMAGE}
                  alt={charityInfo.name || charityInfo.title}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </div>
            )}
            <div className="text-white">
              <h3 className="text-xl font-bold">
                {charityInfo.name || charityInfo.title}
              </h3>
              <div className="flex items-center gap-2">
                {charityInfo.verified && (
                  <span className="bg-primary/30 border backdrop-blur-md border-primary text-white text-xs px-2 py-1 rounded">
                    Verified
                  </span>
                )}
                {charityInfo.premium && (
                  <span className="bg-[#f7931a]/30 border border-[#f7931a] backdrop-blur-md text-white text-xs px-2 py-1 rounded">
                    Premium
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="p-4 md:p-6">
        <p className="text-muted-foreground mb-4">{charityInfo.mission}</p>
        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          {charityInfo.location && (
            <div>
              <span className="font-medium">Location:</span>
              <p className="text-muted-foreground">
                {typeof charityInfo.location === "object"
                  ? charityInfo.location.headquarters
                  : charityInfo.location}
              </p>
            </div>
          )}
          {charityInfo.founded && (
            <div>
              <span className="font-medium">Founded:</span>
              <p className="text-muted-foreground">{charityInfo.founded}</p>
            </div>
          )}
        </div>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((tag: string, index: number) => (
              <span
                key={index}
                className="bg-muted border border-border text-muted-foreground text-xs px-2 py-1"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        {charityInfo.bitcoinAddress && (
          <div className="bg-muted p-4 rounded-md">
            <h4 className="font-medium mb-2">Bitcoin Donation Address</h4>
            <div className="bg-background p-2 rounded border border-border text-sm font-mono break-all">
              {charityInfo.bitcoinAddress}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const OrganizationDetails = ({ organization }: { organization?: any }) => {
  if (!organization)
    return (
      <div className="w-full h-36 bg-muted rounded-md animate-pulse"></div>
    );

  const tags = Array.isArray(organization.tags)
    ? organization.tags
    : typeof organization.tags === "string"
      ? JSON.parse(organization.tags)
      : [];

  return (
    <div className="border border-border rounded-md p-4 bg-card">
      <div className="flex items-center gap-3 mb-4">
        {organization.image && (
          <img
            src={organization.image}
            alt={organization.title}
            className="size-12 rounded"
          />
        )}
        <div>
          <h3 className="font-medium text-lg">{organization.title}</h3>
          <div className="text-sm text-muted-foreground">
            {organization.nickname}
          </div>
        </div>
      </div>
      <p className="my-2">{organization.mission}</p>
      <div className="grid grid-cols-2 gap-2 text-sm">
        {organization.location && (
          <div>
            <span className="font-medium">Location:</span>{" "}
            {organization.location}
          </div>
        )}
        {organization.website && (
          <div>
            <span className="font-medium">Website:</span>{" "}
            <a
              href={organization.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Visit Site
            </a>
          </div>
        )}
        {organization.founder && (
          <div>
            <span className="font-medium">Founder:</span>{" "}
            {organization.founder}
          </div>
        )}
        {organization.president && (
          <div>
            <span className="font-medium">President:</span>{" "}
            {organization.president}
          </div>
        )}
      </div>
      {tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {tags.map((tag: string, index: number) => (
            <span
              key={index}
              className="bg-muted border border-border text-muted-foreground text-xs px-2 py-1"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
      {organization.fullContext && (
        <div className="mt-4 p-3 bg-primary/10 border-primary border text-sm rounded">
          <span className="font-medium">Additional Context:</span>
          <p className="mt-1 text-muted-foreground">
            {organization.fullContext}
          </p>
        </div>
      )}
      {organization.bitcoinAddress && (
        <div className="mt-4 p-3 bg-primary/10 border-primary border text-sm rounded">
          <h4 className="font-medium mb-2">Bitcoin Donation Address</h4>
          <span className="font-mono text-xs break-all">
            {organization.bitcoinAddress}
          </span>
        </div>
      )}
    </div>
  );
};

const DonationCalculator = ({ donationDetails }: { donationDetails?: any }) => {
  if (!donationDetails)
    return (
      <div className="w-full h-24 bg-muted rounded-md animate-pulse"></div>
    );

  return (
    <div className="border border-border rounded-md p-4 space-y-2 bg-card">
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
      <div className="mt-2 p-2 bg-green-500/10 border border-green-500/20 text-green-700 dark:text-green-400 rounded-md">
        <span className="font-medium">Impact:</span>{" "}
        {donationDetails.estimatedImpact}
      </div>

      {donationDetails.bitcoinAddress && (
        <div className="mt-4 border-t border-border pt-4">
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
      <div className="w-full h-24 bg-muted rounded-md animate-pulse"></div>
    );

  return (
    <div className="border border-border rounded-md p-4 space-y-2 bg-card">
      <h3 className="font-medium text-lg">Make a Bitcoin Donation</h3>
      <div className="text-sm text-muted-foreground mb-2">
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
      <div className="w-full h-16 bg-muted rounded-md animate-pulse"></div>
    );

  return (
    <div className="border border-border rounded-md p-4 bg-card">
      <div
        className={`flex items-center ${result?.hasCompletedPayment ? "text-green-600 dark:text-green-400" : "text-amber-600 dark:text-amber-400"}`}
      >
        <div
          className={`rounded-full size-6 mr-2 flex items-center justify-center ${result?.hasCompletedPayment ? "bg-green-500/20" : "bg-amber-500/20"}`}
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
      <div className="w-full h-36 bg-muted rounded-md animate-pulse"></div>
    );

  return (
    <div className="border border-border rounded-md p-4 space-y-2 bg-card">
      <div className="flex justify-between items-center">
        <h3 className="font-medium text-lg">Donation Receipt</h3>
        <div className="text-xs bg-green-500/20 text-green-700 dark:text-green-400 px-2 py-1 rounded-full">
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
      <div className="mt-2 p-2 bg-primary/10 border border-primary/20 text-primary rounded-md">
        <span className="font-medium">Impact:</span> {receipt.estimatedImpact}
      </div>
      <div className="mt-2">
        <button className="border border-primary text-primary px-4 py-2 rounded-md w-full hover:bg-primary/10 transition-colors">
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
      <div className="size-[24px] border border-border rounded-sm p-1 flex flex-col justify-center items-center shrink-0 text-zinc-500">
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
                    {toolName === "getOrganizations" ? (
                      <OrganizationList organizations={result} />
                    ) : toolName === "getOrganizationInfo" ? (
                      <OrganizationDetails organization={result} />
                    ) : toolName === "searchCharities" ? (
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
                    {toolName === "getOrganizations" ? (
                      <OrganizationList />
                    ) : toolName === "getOrganizationInfo" ? (
                      <OrganizationDetails />
                    ) : toolName === "searchCharities" ? (
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
