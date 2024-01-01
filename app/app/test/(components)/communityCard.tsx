import { cn, generateInitials, getColorForName } from "@/lib/utils";
import { Prisma } from "@prisma/client";

import { Avatar } from "@/components/catalyst/avatar";
import Link from "next/link";

const communityWith = Prisma.validator<Prisma.CommunityDefaultArgs>()({
  include: {
    communityData: false
  }
});

type Props = {
  community: Prisma.CommunityGetPayload<typeof communityWith>;
};

export default function CommunityCard({ community }: Props) {
  const communityLink = community.customDomain ?? `${community.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`;

  return (
    <li key={community.id} className="overflow-hidden rounded-xl border border-gray-200 hover:border-gray-400" tabIndex={0}>
      <Link
        className="absolute inset-0 z-10"
        href={`community/${community.id}`}
      />
      <div className="relative">
        <div className="flex items-center gap-x-4 border-b border-gray-900/5 bg-gray-50 p-3">
          <Avatar
            initials={generateInitials(community.name, 3)}
            className={cn(getColorForName(community.name), "h-8 w-8 flex-none rounded-lg object-cover ring-1 ring-gray-900/10")}
          />
          <div className="text-sm font-medium leading-6 text-gray-900">{community.name}</div>
        </div>
        <dl className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6">
          <div className="flex justify-between gap-x-4 py-3">
            <dt className="text-gray-500">Plan</dt>
            <dd className="text-gray-700 flex-shrink-1 truncate">
              <div
                className={cn("text-green-700 bg-green-50 ring-green-600/20",
                  'rounded-md py-1 px-2 text-xs font-medium ring-1 ring-inset'
                )}
              >
                Free Tier
              </div>
            </dd>
          </div>
          <div className="flex justify-between gap-x-4 py-3">
            <dt className="text-gray-500">Members</dt>
            <dd className="flex items-start gap-x-2">
              <div className="text-gray-900">300</div>
              {/* <div
                className={cn("text-green-700 bg-green-50 ring-green-600/20",
                  'rounded-md py-1 px-2 text-xs font-medium ring-1 ring-inset'
                )}
              >
                Tag
              </div> */}
            </dd>
          </div>
          <div className="flex justify-between gap-x-4 py-3">
            <dt className="text-gray-500">URL</dt>
            <dd className="flex flex-shrink-1 truncate items-start gap-x-2">
              <a
                href={communityLink}
                target="_blank"
                rel="noreferrer"
                className="z-20 flex flex-shrink-1 truncate rounded-md bg-stone-100 px-2 py-1 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-200">
                <span
                  className="flex-shrink-1 truncate break-all"
                >
                  {communityLink}
                </span>
                <span className="ml-1">↗</span>
              </a>
            </dd>
          </div>
        </dl>
      </div>
    </li>
  );
}
