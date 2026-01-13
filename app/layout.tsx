import localFont from "next/font/local";
import LazyAppProviders from "./components/LazyAppProviders";
import "./globals.css";
import { getSEOTags } from "./lib/seo";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = getSEOTags({
  title: "Summary AI",
  description:
    "Summary AI is a cutting-edge AI Note Taker designed for iOS, offering seamless recording, transcription, and summarization of your audio content. You can record meetings and phone calls, import podcasts and YouTube videos, and much more.",
  canonicalUrlRelative: "/",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* TODO(yago): Add license key to the environment variables */}
        <LazyAppProviders licenseKey={process.env.NEXT_PUBLIC_PDF_VIEWER_LICENSE_KEY || "YOUR_LICENSE_KEY"}>
          {children}
        </LazyAppProviders>
      </body>
    </html>
  );
}
