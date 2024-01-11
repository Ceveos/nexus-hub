"use client";

import { usePathname, useSelectedLayoutSegments } from "next/navigation";
import Breadcrumb, { type Page } from "@nextjs/components/dashboard/breadcrumb";


interface Props {
  communityName: string;
};
const CommunityBreadcrumbs: React.FC<Props> = ({ communityName }) => {
  const segments = useSelectedLayoutSegments();
  const path = usePathname();
  const relativePath = path.replace(segments.length > 0 ? `/${segments.join("/")}` : "", "");
  
  const breadcrumbPages: Page[] = [
    {
      name: "Communities",
      href: `${relativePath}/../../communities/`
    },
    {
      name: communityName,
      href: relativePath
    }
  ]

  segments.forEach((segment, index) => {
    breadcrumbPages.push({
      name: segment,
      href: `${relativePath}/${segments.slice(0, index + 1).join("/")}`
    })
  });

  return <Breadcrumb pages={breadcrumbPages} />
}

export default CommunityBreadcrumbs;