import { type ReactNode } from "react";
import { notFound, redirect } from "next/navigation";
import { getCommunityDataByDomain } from "@nextjs/lib/fetchers";
import { type Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { domain: string };
}): Promise<Metadata | null> {
  const domain = decodeURIComponent(params.domain);
  const data = await getCommunityDataByDomain(domain);
  if (!data) {
    return null;
  }
  const {
    name: title,
    description,
  } = data as {
    name: string;
    description: string;
  };

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      // images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      // images: [image],
      creator: "@vercel",
    },
    // icons: [logo],
    metadataBase: new URL(`https://${domain}`),
    // Optional: Set canonical URL to custom domain if it exists
    ...(params.domain.endsWith(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`) &&
      data.customDomain && {
      alternates: {
        canonical: `https://${data.customDomain}`,
      },
    }),
  };
}

export default async function SiteLayout({
  params,
  children,
}: {
  params: { domain: string };
  children: ReactNode;
}) {
  const domain = decodeURIComponent(params.domain);
  const data = await getCommunityDataByDomain(domain);

  if (!data) {
    notFound();
  }

  // Optional: Redirect to custom domain if it exists
  if (
    domain.endsWith(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`) &&
    data.customDomain &&
    process.env.REDIRECT_TO_CUSTOM_DOMAIN_IF_EXISTS === "true"
  ) {
    return redirect(`https://${data.customDomain}`);
  }

  return <>

    <html lang="en" className="h-full" suppressHydrationWarning>
      <body className="h-full">
        {children}
      </body>
    </html>
  </>;
}
