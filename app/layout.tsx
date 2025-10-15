import { ThemeProvider } from "@/components/components/theme-provider";

import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { TRPCReactProvider } from "@/trpc/react";
import { Toaster } from "sonner";
import Script from "next/script";
import localFont from "next/font/local";
export const viewport = {
  maximumScale: 1, // Disable auto-zoom on mobile Safari
};
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter-sans",
  subsets: ["latin"],
});
const valve = localFont({
  src: [
    // Plain variants
    {
      path: "../public/fonts/valve/PPValve-PlainExtralight.otf",
      weight: "200",
      style: "normal",
    },
    {
      path: "../public/fonts/valve/PPValve-PlainExtralightItalic.otf",
      weight: "200",
      style: "italic",
    },
    {
      path: "../public/fonts/valve/PPValve-PlainMedium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/valve/PPValve-PlainMediumItalic.otf",
      weight: "500",
      style: "italic",
    },
    {
      path: "../public/fonts/valve/PPValve-PlainExtrabold.otf",
      weight: "800",
      style: "normal",
    },
    {
      path: "../public/fonts/valve/PPValve-PlainExtraboldItalic.otf",
      weight: "800",
      style: "italic",
    },
  ],
  variable: "--font-valve", // optional: lets you use it in Tailwind or CSS
});
// Corp Compact - Narrower, more condensed
const corpCompact = localFont({
  src: [
    {
      path: "../public/fonts/corp/PPNeueCorp-CompactUltralight.otf",
      weight: "200",
      style: "normal",
    },
    {
      path: "../public/fonts/corp/PPNeueCorp-CompactMedium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/corp/PPNeueCorp-CompactUltrabold.otf",
      weight: "800",
      style: "normal",
    },
  ],
  variable: "--font-corp-compact",
});

// Corp Normal - Standard width
const corpNormal = localFont({
  src: [
    {
      path: "../public/fonts/corp/PPNeueCorp-NormalUltralight.otf",
      weight: "200",
      style: "normal",
    },
    {
      path: "../public/fonts/corp/PPNeueCorp-NormalMedium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/corp/PPNeueCorp-NormalUltrabold.otf",
      weight: "800",
      style: "normal",
    },
  ],
  variable: "--font-corp-normal",
});

// Corp Extended - Wider, more spaced
const corpExtended = localFont({
  src: [
    {
      path: "../public/fonts/corp/PPNeueCorp-ExtendedUltralight.otf",
      weight: "200",
      style: "normal",
    },
    {
      path: "../public/fonts/corp/PPNeueCorp-ExtendedMedium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/corp/PPNeueCorp-ExtendedUltrabold.otf",
      weight: "800",
      style: "normal",
    },
  ],
  variable: "--font-corp-extended",
});
const LIGHT_THEME_COLOR = "oklch(0% 0 0)";
const DARK_THEME_COLOR = "oklch(0% 0 0)";
const THEME_COLOR_SCRIPT = `\
(function() {
  var html = document.documentElement;
  var meta = document.querySelector('meta[name="theme-color"]');
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('name', 'theme-color');
    document.head.appendChild(meta);
  }
  function updateThemeColor() {
    var isDark = html.classList.contains('dark');
    meta.setAttribute('content', isDark ? '${DARK_THEME_COLOR}' : '${LIGHT_THEME_COLOR}');
  }
  var observer = new MutationObserver(updateThemeColor);
  observer.observe(html, { attributes: true, attributeFilter: ['class'] });
  updateThemeColor();
})();`;

export const metadata: Metadata = {
  title: "Keyf | The AI Video Generator",
  description: "Scale your campaigns with creatives powered by AI.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className="scrollbar-thin scrollbar-thumb-accent scrollbar-track-transparent"
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: THEME_COLOR_SCRIPT,
          }}
        />
        {process.env.NODE_ENV !== "production" ? (
          <Script
            src="https://unpkg.com/react-scan/dist/auto.global.js"
            strategy="beforeInteractive"
          />
        ) : null}
        <meta name="apple-mobile-web-app-title" content="Keyf" />
      </head>
      <body
        className={`font-inter ${inter.variable} ${valve.variable} ${corpCompact.variable} ${corpNormal.variable} ${corpExtended.variable} bg-background antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="root">
            <TRPCReactProvider>{children}</TRPCReactProvider>
          </div>
          <Toaster theme="dark" />
        </ThemeProvider>
      </body>
    </html>
  );
}
