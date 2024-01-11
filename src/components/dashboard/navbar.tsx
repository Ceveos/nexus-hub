'use client'

import {
  type Dispatch,
  type SetStateAction,
  type ReactNode,
  useEffect,
} from "react";
import { Bars3Icon, MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import { Dropdown, DropdownMenu } from "../catalyst/dropdown";
import { MenuButton as HeadlessMenuButton } from '@headlessui/react'
import { Button } from "../catalyst/button";
import { useTheme } from "next-themes";
import React from "react";

interface Props {
  userNavigation: JSX.Element;
  setSidebarOpen: Dispatch<SetStateAction<boolean>>;
  navbarAvatar: ReactNode;
}

const Navbar: React.FC<Props> = ({
  navbarAvatar,
  userNavigation,
  setSidebarOpen,
}) => {
  const [mounted, setMounted] = React.useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  return (
    <div className="sticky top-0 z-20 flex h-16 shrink-0 items-center gap-x-4 border-b border-primary-300 bg-white dark:bg-primary-dark-900 dark:border-primary-dark-800 px-4 shadow-sm sm:gap-x-6">
      <button
        type="button"
        className="-m-2.5 p-2.5 text-gray-700 dark:text-gray-400 lg:hidden"
        onClick={() => setSidebarOpen(true)}
      >
        <span className="sr-only">Open sidebar</span>
        <Bars3Icon className="h-6 w-6" aria-hidden="true" />
      </button>

      {/* Separator */}
      <div className="h-6 w-px bg-gray-900/10 lg:hidden" aria-hidden="true" />

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">

        <div className="flex ml-auto items-center gap-x-4 lg:gap-x-6">
          {/* <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500"
          >
            <span className="sr-only">View notifications</span>
            <BellIcon className="h-6 w-6" aria-hidden="true" />
          </button> */}

          <Button
            disabled={!mounted}
            plain
            className="h-10 w-10 transition-all"
            onClick={() => setTheme(resolvedTheme === "light" ? "dark" : "light")}
          >
            {mounted && resolvedTheme === "light" && <SunIcon />}
            {mounted && resolvedTheme === "dark" && <MoonIcon />}
          </Button>

          {/* Separator */}
          {/* <div
              className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-900/10"
              aria-hidden="true"
            /> */}

          {/* Profile dropdown */}
          <Dropdown>
            <HeadlessMenuButton
              className="flex w-48 items-center gap-3 rounded-xl border border-transparent p-1 data-[active]:border-zinc-200 data-[hover]:border-zinc-200 dark:data-[active]:border-zinc-700 dark:data-[hover]:border-zinc-700"
              aria-label="Account options"
            >
              {navbarAvatar}
            </HeadlessMenuButton>
            <DropdownMenu className="min-w-[--button-width]">
              {userNavigation}
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
