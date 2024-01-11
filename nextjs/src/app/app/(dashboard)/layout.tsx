import { type ReactNode } from "react";
import Dashboard, { type SidebarProps } from "@nextjs/components/dashboard/dashboard";
import NavbarAvatar from "@nextjs/components/dashboard/navbar.avatar.component";
import { type Metadata } from "next";
import { dashboardLinks, externalLinks } from "../(data)/navLinks";
import { userNavigationLinks } from "../(data)/navLinks.client";

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
    <Dashboard
      navbarAvatar={<NavbarAvatar />}
      sidebarProps={sidebarProps}
    >
        {children}
    </Dashboard>
  );
};

export default DashboardLayout;
