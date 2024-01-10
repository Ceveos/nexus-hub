import { Metadata } from "next";
import { Providers } from "../(providers)/providers";
import { Analytics } from "@vercel/analytics/react";

const title =
  "Nexus Hub";

export const metadata: Metadata = {
  title,
  icons: ["https://nexushub.app/favicon.ico"],
  openGraph: {
    title,
  },
  twitter: {
    card: "summary_large_image",
    title,
    creator: "@Ceveos",
  },
  metadataBase: new URL("https://nexushub.app"),
};

export default function LandingLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
    <body>
      <Providers>
        {children}
        <Analytics />
      </Providers>
    </body>
  </html>
  );
}
