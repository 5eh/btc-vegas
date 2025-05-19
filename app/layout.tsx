import { Metadata } from "next";
import { Toaster } from "sonner";

import { Navbar } from "@/components/custom/navbar";
import { ThemeProvider } from "@/components/custom/theme-provider";
import { Footer } from "@/components/ui/footer";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://charity.ai"),
  title: "Bitcoin Charity Searches",
  description: "Next.js chatbot template using the AI SDK and Gemini.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Toaster position="top-center" />
          <Navbar />
          <main className=" max-w-6xl mx-auto ">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
