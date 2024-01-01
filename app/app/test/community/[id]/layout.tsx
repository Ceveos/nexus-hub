import { type ReactNode } from "react";
import { type Metadata } from "next";
import { getCommunityDataById } from "@/lib/fetchers";
import { notFound } from "next/navigation";
import Breadcrumb, { type Page } from "../../(components)/breadcrumb";


export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata | null> {
  const communityId = decodeURIComponent(params.id);
  const data = await getCommunityDataById(communityId);
  if (!data) {
    return null;
  }

  return {
    title: `Nexus Hub - ${data.name}`,
    openGraph: {
      title: `Nexus Hub - ${data.name}`
    },
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

  const breadcrumbPages: Page[] = [
    {
      name: "Communities",
      href: `/communities/`
    },
    {
      name: data.name,
      href: `/community/${communityId}`
    }
  ]


  return (
    <>
    <Breadcrumb pages={breadcrumbPages} />
    {children}
    </>
  );
}