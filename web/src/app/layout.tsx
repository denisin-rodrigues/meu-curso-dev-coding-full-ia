import type { Metadata } from "next";
import { Anton, Anybody, Hanken_Grotesk, Inter } from "next/font/google";
import "./globals.css";

const fontAnybody = Anybody({
  variable: "--font-anybody",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

const fontHanken = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const fontAnton = Anton({ variable: "--font-anton", subsets: ["latin"], weight: "400" });
const fontInter = Inter({ variable: "--font-inter", subsets: ["latin"], weight: ["300", "400", "500"] });

export const metadata: Metadata = {
  title: "Court Elite — Official Game Ball",
  description: "The Standard of Excellence in professional basketball equipment.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fontAnybody.variable} ${fontHanken.variable} ${fontAnton.variable} ${fontInter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-hanken bg-background text-foreground overflow-x-hidden" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
