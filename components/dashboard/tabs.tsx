"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname, useRouter, useSelectedLayoutSegment } from "next/navigation";

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
        <label htmlFor="tabs" className="sr-only">
          Select a tab
        </label>
        {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
        <select
          id="tabs"
          name="tabs"
          className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          defaultValue={tabs.find((tab) => (tab.segment ?? null) === segment)!.segment}
          onChange={(e) => router.push([relativePath, e.target.value].filter(Boolean).join("/"))}
        >
          {tabs.map((tab) => (
            <option key={tab.name} value={tab.segment ?? ""}>{tab.name}</option>
          ))}
        </select>
      </div>
      <div className="hidden sm:block">

        {/* <header className="border-b border-gray-200">
          <nav className="flex overflow-x-auto py-4">
            <ul
              role="list"
              className="flex min-w-full flex-none gap-x-6 px-4 text-sm font-semibold leading-6 text-gray-500 sm:px-6 lg:px-8"
            >
              {tabs.map((tab) => (
                <li key={tab.name}>
                  <Link href={[relativePath, tab.segment].filter(Boolean).join("/")} className={(tab.segment ?? null) === segment ? 'text-indigo-600' : ''}>
                    {tab.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </header> */}



        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 " aria-label="Tabs">
            {tabs.map((tab) => (
              <Link
                key={tab.name}
                href={[relativePath, tab.segment].filter(Boolean).join("/")}
                className={clsx(
                  (tab.segment ?? null) === segment
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
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
