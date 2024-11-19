import Navbar from './components/navbar'; // Import the Navbar component
import localFont from "next/font/local";
import "./globals.css";
import React from 'react';

/**
 * Layout Component
 *
 * Defines the root layout for the Spark Bytes application.
 *
 * Purpose:
 * - Sets up the global layout for pages, including a shared Navbar and font styles.
 * - Applies custom local fonts (Geist Sans and Geist Mono) using CSS variables.
 * - Provides metadata like the app's title and description.
 *
 * Features:
 * - Displays a Navbar at the top of every page.
 * - Uses custom local fonts and applies them via CSS variables.
 * - Wraps all child components in a consistent layout with padding.
 *
 * Usage:
 * Used as the default layout for all pages in the app.
 *
 * Styling:
 * - Global CSS is imported from 'globals.css'.
 * - Applies fonts through CSS variables set on the 'body' element.
 */

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Navbar /> {/* Use Navbar component here */}
        <main style={{ padding: '20px' }}>
          {children}
        </main>
      </body>
    </html>
  );
}