import { headers } from "next/headers";
// import { getPostsForSite } from "@nextjs/lib/fetchers";

export default function Sitemap() {
  const headersList = headers();
  const domain =
    headersList
      .get("host")
      ?.replace(/localhost:\d+/g, process.env.NEXT_PUBLIC_ROOT_DOMAIN!);

  // const posts = await getPostsForSite(domain);

  return [
    {
      url: `https://${domain}`,
      lastModified: new Date(),
    },
    // ...posts.map(({ slug }) => ({
    //   url: `https://${domain}/${slug}`,
    //   lastModified: new Date(),
    // })),
  ];
}
