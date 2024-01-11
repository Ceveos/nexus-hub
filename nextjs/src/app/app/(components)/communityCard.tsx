import { cn, generateInitials, getColorForName } from "@/lib/utils";
import { Prisma } from "@prisma/client";

import { Avatar } from "@/components/catalyst/avatar";
import Link from "next/link";
import { Badge } from "@/components/catalyst/badge";
import { ArrowRightCircleIcon } from "@heroicons/react/24/outline";

const communityWith = Prisma.validator<Prisma.CommunityDefaultArgs>()({
  include: {
    communityData: false
  }
});

type Props = {
  community: Prisma.CommunityGetPayload<typeof communityWith>;
};

export default function CommunityCard({ community }: Props) {
  const https = process.env.NODE_ENV === 'production' ? 'https' : 'http';
  const communityLink = community.customDomain ?? `${community.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`;;

  return (
    <li key={community.id} className=" relative rounded-xl border border-primary-200 hover:border-primary-400 dark:border-primary-dark-700 dark:hover:border-primary-dark-500 text-primary-500 hover:text-primary-600 dark:text-primary-dark-400 dark:hover:text-primary-dark-200" >
      <Link
        className="absolute inset-0 z-10 focus:ring-primary-400 dark:focus:ring-primary-dark-600 focus:ring-2 focus:outline-none rounded-xl"
        href={`community/${community.id}`}
      />
      <div className="relative ">
        <div className="rounded-t-xl flex items-center gap-x-4 border-b border-primary-900/5 bg-primary-50 dark:bg-primary-dark-800 p-3">
          <Avatar
            square
            initials={generateInitials(community.name, 2)}
            className={cn(community.avatarClass ?? getColorForName(community.name), "h-8 w-8 flex-none rounded-lg object-cover ring-1 ring-gray-900/10")}
          />
          <div className="text-sm font-medium leading-6 text-gray-900 dark:text-white">{community.name}</div>
          <ArrowRightCircleIcon className="ml-auto h-6 w-6 " aria-hidden="true" />
        </div>
        <dl className="-my-3 divide-y divide-primary-200 dark:divide-primary-dark-700 px-6 py-4 text-sm leading-6">
          <div className="flex justify-between gap-x-4 py-3">
            <dt className="text-primary-500 dark:text-primary-dark-400">Plan</dt>
            <dd className="text-primary-700 dark:text-primary-dark-300 flex-shrink-1 truncate">
              <Badge color="green">Free Tier</Badge>
            </dd>
          </div>
          <div className="flex justify-between gap-x-4 py-3">
            <dt className="text-primary-500 dark:text-primary-dark-400">Members</dt>
            <dd className="flex items-start gap-x-2">
              <div className="text-primary-900 dark:text-primary-dark-300">300</div>
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
            <dt className="text-gray-500 dark:text-primary-dark-400">URL</dt>
            <dd className="flex flex-shrink-1 truncate items-center gap-x-2">
              <a
                href={`${https}://${communityLink}`}
                target="_blank"
                rel="noreferrer"
                className="z-10 flex flex-shrink-1 truncate rounded-md bg-primary-200 dark:bg-primary-dark-600 dark:text-primary-dark-100 px-2 py-1 text-sm font-medium text-primary-600 hover:bg-primary-300 hover:dark:bg-primary-dark-500 focus:bg-primary-300 focus:dark:bg-primary-dark-500 focus:ring-0 focus:outline-none">
                
                <span
                  className="flex-shrink-1 truncate break-all select-none"
                >
                  {communityLink}
                </span>
                <ArrowRightCircleIcon className="h-4 ml-1 self-center" />
              </a>
            </dd>
          </div>
        </dl>
      </div>
    </li>
  );
}
