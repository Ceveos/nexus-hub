import { type ReactNode } from "react";
import Dashboard from "./(components)/dashboard";
import NavbarAvatar from "./(components)/navbar.avatar.component";
import DashboardContent from "./(components)/dashboardContent";
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

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="h-full bg-white">
      <Providers>
        <Dashboard
          navbarAvatar={<NavbarAvatar />}
        >
          <DashboardContent>{children}</DashboardContent>
        </Dashboard>
      </Providers>
    </div>
  );
};

export default DashboardLayout;
