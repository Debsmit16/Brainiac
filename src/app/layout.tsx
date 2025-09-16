import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from '@/components/ThemeProvider';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Brainac - Learn Smarter, Learn Faster",
  description: "An innovative edtech platform offering personalized learning experiences with gamification, progress tracking, and expert mentorship.",
  keywords: "education, learning, edtech, online courses, personalized learning, gamification",
  authors: [{ name: "Brainac Team" }],
  creator: "Brainac",
  publisher: "Brainac",
  robots: "index, follow",
  metadataBase: new URL('https://brainac.app'),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://brainac.app",
    title: "Brainac - Learn Smarter, Learn Faster",
    description: "An innovative edtech platform offering personalized learning experiences with gamification, progress tracking, and expert mentorship.",
    siteName: "Brainac",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Brainac - Learn Smarter, Learn Faster",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Brainac - Learn Smarter, Learn Faster",
    description: "An innovative edtech platform offering personalized learning experiences with gamification, progress tracking, and expert mentorship.",
    images: ["/og-image.jpg"],
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/icon-192x192.png",
  },
};

export function generateViewport() {
  return {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    themeColor: "#3b82f6",
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <meta name="theme-color" content="#3b82f6" />
      </head>
      <body
        className={`${inter.variable} font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
