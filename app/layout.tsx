import "@/styles/globals.css";
import { cal, inter } from "@/styles/fonts";
import { Analytics } from "@vercel/analytics/react";
import { Providers } from "./(providers)/providers";
import { type Metadata } from "next";
import { cn } from "@/lib/utils";

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body className={cn(cal.variable, inter.variable, "h-full flex flex-col bg-th-background dark:bg-th-background-dark")}>
        <Providers>
          {children}
          <Analytics />
        </Providers>
      </body>
    </html>
  );
}
