"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname, useRouter, useSelectedLayoutSegment } from "next/navigation";
import { Select } from "../catalyst/select";

export interface Tab {
  name: string;
  segment?: string;
}

interface Props {
  tabs: Tab[]
}

const SettingsTabs: React.FC<Props> = ({ tabs }) => {
  const segment = useSelectedLayoutSegment();
  const path = usePathname();
  const relativePath = path.replace(segment ? `/${segment}` : "", "");
  const router = useRouter();

  return (
    <div>
      <div className="sm:hidden pt-2 px-2">
        <Select
          aria-label="Tabs"
          defaultValue={tabs.find((tab) => (tab.segment ?? null) === segment)!.segment}
          onChange={(e) => router.push([relativePath, e.target.value].filter(Boolean).join("/"))}
        >
          {tabs.map((tab) => (
            <option key={tab.name} value={tab.segment ?? ""}>{tab.name}</option>
          ))}
        </Select>
      </div>
      <div className="hidden sm:block">
        <div className="border-b border-primary-300 dark:border-primary-dark-700">
          <nav className="-mb-px flex space-x-8 " aria-label="Tabs">
            {tabs.map((tab) => (
              <Link
                key={tab.name}
                href={[relativePath, tab.segment].filter(Boolean).join("/")}
                className={clsx(
                  (tab.segment ?? null) === segment
                    ? "border-accent-700 dark:border-primary-dark-300 text-accent-700 dark:text-white"
                    : "border-transparent text-primary-500 hover:primary-gray-300 hover:text-primary-700 dark:text-primary-dark-400 hover:dark:text-primary-200",
                  "whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium"
                )}
                aria-current={tab.segment === segment ? "page" : undefined}
              >
                {tab.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default SettingsTabs;
