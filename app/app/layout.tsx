import { type ReactNode } from "react";
import { type Metadata } from "next";

const title =
  "Nexus Hub - Dashboard";
  
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
  metadataBase: new URL("https://nexushub.app/")
};

const AppLayout = ({ children }: { children: ReactNode }) => {
  return children;
};

export default AppLayout;
