import { type ReactNode } from "react";
import { Providers } from "@/app/(providers)/providers";
import { type Metadata } from "next";

const title =
  "Nexus Hub - Dashboard";
  
export const metadata: Metadata = {
  title,
  icons: ["https://www.nexushub.app/favicon.ico"],
  openGraph: {
    title,
  },
  twitter: {
    card: "summary_large_image",
    title,
    creator: "@Ceveos",
  },
  metadataBase: new URL("https://nexushub.app/")
};

const AppLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="h-full bg-white">
      <Providers>
        {children}
      </Providers>
    </div>
  );
};

export default AppLayout;
