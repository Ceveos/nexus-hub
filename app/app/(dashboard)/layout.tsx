import { type ReactNode } from "react";
import Dashboard, { type SidebarProps } from "../(components)/dashboard";
import NavbarAvatar from "../(components)/navbar.avatar.component";
import { type Metadata } from "next";
import { dashboardLinks, externalLinks } from "../(data)/navLinks";
import { userNavigationLinks } from "../(data)/navLinks.client";
import DashboardContent from "../(components)/dashboardContent";

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

const sidebarProps: SidebarProps = {
  navigationLinks: await dashboardLinks(),
  externalLinks: await externalLinks(),
  userNavigationLinks: userNavigationLinks,
}

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="h-full bg-white">
      <Dashboard
        navbarAvatar={<NavbarAvatar />}
        sidebarProps={sidebarProps}
      >
        <DashboardContent>
          {children}
        </DashboardContent>
      </Dashboard>
    </div>
  );
};

export default DashboardLayout;
