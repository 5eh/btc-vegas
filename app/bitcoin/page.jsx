"use client";
import { BitcoinQR } from "@ibunker/bitcoin-react";
import "@ibunker/bitcoin-react/dist/index.css";

const Page = () => {
  return (
    <BitcoinQR
      amount={0.00001}
      bitcoinAddress="bc1qljwyvtarj5mvtf85ch3fa042qmquuemqgfh3wg"
      message="Contribute to Organization Bitcoin"
      title="Charity Name"
    />
  );
};
export default Page;
