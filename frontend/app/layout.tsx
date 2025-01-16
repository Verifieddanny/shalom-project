import type { Metadata } from "next";
import { AuthProvider } from "@/context/AuthContext";
import localFont from "next/font/local";
import "./globals.css";

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

export const metadata: Metadata = {
  title: "Result alert system using sms and email",
  description: "The next school app",
  openGraph: {
    images: "/opengraph-image.png",
  },
  metadataBase: new URL("https://result-alert-system-using-sms-and-email.vercel.app/"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
    
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased mx-auto`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
