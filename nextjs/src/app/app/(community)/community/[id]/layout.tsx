import { type ReactNode } from "react";
import Dashboard, { type SidebarProps } from "@nextjs/components/dashboard/dashboard";
import NavbarAvatar from "@nextjs/components/dashboard/navbar.avatar.component";
import DashboardContent from "@nextjs/components/dashboard/dashboardContent";
import { type Metadata } from "next";
import { communityLinks, externalLinks } from "../../../(data)/navLinks";
import { getCommunityDataById } from "@nextjs/lib/fetchers";
import { notFound } from "next/navigation";
import communitySidebarHeader from "../../../(components)/communitySidebarHeader";
import { userNavigationLinks } from "../../../(data)/navLinks.client";
// import CommunityBreadcrumbs from "./communityBreadcrumbs";
  
export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata | null> {
  const id = decodeURIComponent(params.id);
  const data = await getCommunityDataById(id);
  if (!data) {
    return null;
  }

  const {
    name,
    description,
    // logo,
  } = data as {
    name: string;
    description: string;
    // logo: string;
  };

  const title = `Nexus Hub - ${name}`;

  return {
    title,
    description,
    icons: ["https://nexushub.app/favicon.ico"],
    openGraph: {
      title,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: "@Ceveos",
    },
    metadataBase: new URL(`https://${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`),
  };
}

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
    header: communitySidebarHeader({ id: data.id, name: data.name, avatarClass: data.avatarClass ?? undefined }),
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
        {/* <CommunityBreadcrumbs communityName={data.name} /> */}
        {children}
      </DashboardContent>
    </Dashboard>
  );
};