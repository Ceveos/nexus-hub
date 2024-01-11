import prisma from "@nextjs/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import { getServerAuthSession } from "@nextjs/lib/auth";
import { getCommunityDataByDomain } from "@nextjs/lib/fetchers";

export async function generateStaticParams() {
  const allSites = await prisma.site.findMany({
    select: {
      subdomain: true,
      customDomain: true,
    },
  });

  const allPaths = allSites
    .flatMap(({ subdomain, customDomain }) => [
      subdomain && {
        domain: `${subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`,
      },
      customDomain && {
        domain: customDomain,
      },
    ])
    .filter(Boolean);

  return allPaths;
}

export default async function SiteHomePage({
  params,
}: {
  params: { domain: string };
}) {
  const domain = decodeURIComponent(params.domain);
  const data = await getCommunityDataByDomain(domain);
  const session = await getServerAuthSession();

  return (<>
    <p className="text-white">
      {JSON.stringify(session)}
    </p>
  </>)

  if (!data) {
    notFound();
  }

  return (
    <>
      <div className="mb-20 w-full">
        <div className="flex flex-col items-center justify-center py-20">
          <Image
            alt="missing post"
            src="https://illustrations.popsy.co/gray/success.svg"
            width={400}
            height={400}
            className="dark:hidden"
          />
          <Image
            alt="missing post"
            src="https://illustrations.popsy.co/white/success.svg"
            width={400}
            height={400}
            className="hidden dark:block"
          />
          <p className="font-title text-2xl text-stone-600 dark:text-stone-400">
            No posts yet.
          </p>
        </div>
      </div>
    </>
  );
}
