import { type ReactNode } from "react";
import Dashboard, { type SidebarProps } from "../../../(components)/dashboard";
import NavbarAvatar from "../../../(components)/navbar.avatar.component";
import DashboardContent from "../../../(components)/dashboardContent";
import { type Metadata } from "next";
import { communityLinks, externalLinks } from "../../../(data)/navLinks";
import { getCommunityDataById } from "@/lib/fetchers";
import { notFound } from "next/navigation";
// import communitySidebarHeader from "../../../(components)/communitySidebarHeader";
import { userNavigationLinks } from "../../../(data)/navLinks.client";
import CommunityBreadcrumbs from "./communityBreadcrumbs";

const title =
  "Nexus Hub - Community";

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

interface Props {
  params: { id: string };
  children: ReactNode;
};

export default async function CommunityLayout({
  params,
  children,
}: Props) {
  const communityId = decodeURIComponent(params.id);
  const data = await getCommunityDataById(communityId);
  if (!data) {
    notFound();
  }

  const sidebarProps: SidebarProps = {
    // header: communitySidebarHeader({ id: data.id, name: data.name }),
    navigationLinks: await communityLinks(),
    externalLinks: await externalLinks(),
    userNavigationLinks: userNavigationLinks,
  }

  return (
    <Dashboard
      navbarAvatar={<NavbarAvatar />}
      sidebarProps={sidebarProps}
    >
      <DashboardContent>
        <CommunityBreadcrumbs communityName={data.name} />
        {children}
      </DashboardContent>
    </Dashboard>
  );
};