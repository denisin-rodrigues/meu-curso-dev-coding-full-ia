import type { Metadata } from "next";
import { Anton, Anybody, Hanken_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import { Navbar } from "@/components/landing/Navbar";
import { SmoothScrollProvider } from "@/components/SmoothScrollProvider";
import "./globals.css";
import localFont from "next/font/local";

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

// JetBrains Mono — usada nos rótulos/metadados (label-caps) do design system athletic.
const fontMono = JetBrains_Mono({ variable: "--font-jetbrains-mono", subsets: ["latin"], weight: ["500"] });

const fontMonument = localFont({
  src: [
    {
      path: '../fonts/MonumentExtended-Regular.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../fonts/MonumentExtended-Ultrabold.otf',
      weight: '800',
      style: 'normal',
    },
  ],
  variable: "--font-monument",
});

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
      className={`${fontAnybody.variable} ${fontHanken.variable} ${fontAnton.variable} ${fontInter.variable} ${fontMono.variable} ${fontMonument.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-hanken bg-background text-foreground overflow-x-hidden" suppressHydrationWarning>
        <SmoothScrollProvider>
          <Navbar />
          {children}
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
