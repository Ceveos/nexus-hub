"use client";

import clsx from "clsx";
import { usePathname, useRouter, useSelectedLayoutSegment } from "next/navigation";

export interface Tab {
  name: string;
  segment?: string;
}

interface Props {
  tabs: Tab[]
}

const SettingsTabs: React.FC<Props> = ({tabs}) => {
  const segment = useSelectedLayoutSegment();
  const path = usePathname();
  const relativePath = path.replace(segment ? `/${segment}` : "", "");
  const router = useRouter();

  return (
    <div className="pb-5">
      <div className="sm:hidden">
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
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 " aria-label="Tabs">
            {tabs.map((tab) => (
              <a
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
              </a>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default SettingsTabs;
