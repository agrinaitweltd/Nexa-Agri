
import React from "react";
import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { AppProvider } from "../context/AppContext";

export const metadata: Metadata = {
  title: "NexaAgri Enterprise | Managed Agriculture",
  description: "Advanced cloud-based resource management for Agricultural Farming, Processing, and Export businesses.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" className="antialiased scroll-smooth">
        <body className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans">
          <AppProvider>
            {children}
          </AppProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
