import { unstable_cache } from "next/cache";
import prisma from "@nextjs/lib/prisma";

export async function getCommunityDataByDomain(domain: string) {
  const subdomain = domain.endsWith(`.${process.env.NEXT_PUBLIC_HUB_DOMAIN}`)
  ? domain.replace(`.${process.env.NEXT_PUBLIC_HUB_DOMAIN}`, "")
  : null;

  return await unstable_cache(
    async () => {
      return prisma.community.findUnique({
        where: subdomain ? { subdomain } : { customDomain: domain },
      });
    },
    [`${domain}-metadata`],
    {
      revalidate: 900,
      tags: [`${domain}-metadata`],
    },
  )();
}

export async function getCommunityDataById(communityId: string) {
  return await unstable_cache(
    async () => {
      return prisma.community.findUnique({
        where: { id: communityId },
      });
    },
    [`${communityId}-metadata`],
    {
      revalidate: 900,
      tags: [`${communityId}-metadata`],
    },
  )();
}