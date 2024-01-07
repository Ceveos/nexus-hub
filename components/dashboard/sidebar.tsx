'use client'

import LogoIcon from "@/components/svg/logo.svg";
import Image from "next/image";
import { Dialog, Transition } from "@headlessui/react";
import React, { type Dispatch, Fragment, type SetStateAction } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { type NavigationLink } from "@/types";
import { useSelectedLayoutSegments, usePathname } from "next/navigation";
import Link from "next/link";
import clsx from "clsx";

const SidebarIcon: React.FC<{ item: NavigationLink }> = ({ item }) => {
  return (
    <>
      {item.icon && (
        <div className="h-6 w-6 shrink-0" aria-hidden={true}>
          {item.icon}
        </div>
      )}
      {item.initial && (
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-primary-500 dark:border-primary-dark-500 bg-primary-800 dark:bg-primary-dark-800 text-[0.625rem] font-medium text-primary-300 dark:text-primary-dark-400 group-hover:text-white">
          {item.initial}
        </span>
      )}
    </>
  );
};

interface Props {
  header?: React.ReactNode;
  navigationLinks: NavigationLink[];
  externalLinks: NavigationLink[];
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const Sidebar: React.FC<Props> = ({ header, navigationLinks, externalLinks, open, setOpen }) => {
  const segments = useSelectedLayoutSegments();
  const path = usePathname();
  const relativePath = path.replace(segments.length > 0 ? `/${segments.join("/")}` : "", "");

  const isActive = (item: NavigationLink) => {

    // Undefined segments cannot be marked active.
    if (item.segment === undefined) {
      return false;
    }

    // Null segments are active only when we're in the root page of the layout.
    if (item.segment === null) {
      return segments.length === 0;
    }

    const segmentIndex = item.segmentIndex ?? 0;

    // If the segment index is out of bounds, the link is not active.
    if (segments.length <= segmentIndex) {
      return false;
    }

    return segments[segmentIndex] === item.segment;
  }

  return (
    <>
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-30 lg:hidden" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-primary-800/90 dark:bg-primary-dark-800/90" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                    <button
                      type="button"
                      className="-m-2.5 p-2.5"
                      onClick={() => setOpen(false)}
                    >
                      <span className="sr-only">Close sidebar</span>
                      <XMarkIcon
                        className="h-6 w-6 text-white"
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                </Transition.Child>
                {/* Sidebar component, swap this element with another sidebar if you like */}
                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-primary-900 dark:bg-primary-dark-900 px-6 pb-4 ring-1 ring-white/10">
                  {header || (
                    <div className="mt-2 flex h-16 shrink-0 items-center w-full">
                      <Image
                        priority
                        src={LogoIcon}
                        className="mt-2 h-10 w-auto"
                        alt="Nexus Hub"
                      />
                    </div>
                  )}
                  <nav className="flex flex-1 flex-col">
                    <ul role="list" className="flex flex-1 flex-col gap-y-7">
                      <li>
                        <ul role="list" className="-mx-2 space-y-1">
                          {navigationLinks.map((item) => (
                            <li key={item.name}>
                              <Link
                                href={item.relative ? [relativePath, item.href].filter(Boolean).join("/") : item.href}
                                onClick={() => setOpen(false)}
                                className={clsx(
                                  isActive(item)
                                    ? "bg-primary-800 dark:bg-primary-dark-800 text-white"
                                    : "text-primary-300 dark:text-primary-dark-400 hover:bg-primary-800 dark:hover:bg-primary-dark-800 hover:text-white",
                                  "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6"
                                )}
                              >
                                <SidebarIcon item={item} />
                                {item.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </li>
                      <li className="mt-auto">
                        <div className="text-xs font-semibold leading-6 text-primary-400 dark:text-primary-dark-400">
                          Links
                        </div>
                        <ul role="list" className="-mx-2 mt-2 space-y-1">
                          {externalLinks.map((link) => (
                            <li key={link.name}>
                              <a
                                href={link.relative ? [relativePath, link.href].filter(Boolean).join("/") : link.href}
                                onClick={() => setOpen(false)}
                                className={clsx(
                                  isActive(link)
                                    ? "bg-primary-800 dark:bg-primary-dark-800 text-white"
                                    : "text-primary-300 dark:text-primary-dark-400 hover:bg-primary-800 dark:hover:bg-primary-dark-800 hover:text-white",
                                  "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6"
                                )}>
                                <SidebarIcon item={link} />
                                <span className="truncate">{link.name}</span>
                              </a>
                            </li>
                          ))}
                        </ul>
                      </li>
                      {/* <li className="mt-auto">
                        <a
                          href="#"
                          className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-400 hover:bg-gray-800 hover:text-white"
                        >
                          <Cog6ToothIcon
                            className="h-6 w-6 shrink-0"
                            aria-hidden="true"
                          />
                          Settings
                        </a>
                      </li> */}
                    </ul>
                  </nav>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
      {/* Static sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-30 lg:flex lg:w-72 lg:flex-col">
        {/* Sidebar component, swap this element with another sidebar if you like */}
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-primary-900 dark:bg-primary-dark-900 border-r border-primary-900 dark:border-primary-dark-800 px-6 pb-4">
          {header || (
            <div className="mt-2 flex h-16 shrink-0 items-center w-full">
              <Image
                priority
                src={LogoIcon}
                className="h-10 w-auto"
                alt="Nexus Hub"
              />
            </div>
          )}
          <nav className="flex flex-1 flex-col">

            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigationLinks.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.relative ? [relativePath, item.href].filter(Boolean).join("/") : item.href}
                        className={clsx(
                          isActive(item)
                            ? "bg-primary-800 dark:bg-primary-dark-800 text-white"
                            : "text-primary-300 dark:text-primary-dark-400 hover:bg-primary-800 dark:hover:bg-primary-dark-800 hover:text-white",
                          "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6"
                        )}
                      >
                        <SidebarIcon item={item} />
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
              <li className="mt-auto">
                <div className="text-xs font-semibold leading-6 text-primary-400">
                  Links
                </div>
                <ul role="list" className="-mx-2 mt-2 space-y-1">
                  {externalLinks.map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.relative ? [relativePath, link.href].filter(Boolean).join("/") : link.href}
                        className={clsx(
                          isActive(link)
                            ? "bg-primary-800 dark:bg-primary-dark-800 text-white"
                            : "text-primary-300 dark:text-primary-dark-400 hover:bg-primary-800 dark:hover:bg-primary-dark-800 hover:text-white",
                          "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6"
                        )}
                      >
                        <SidebarIcon item={link} />
                        <span className="truncate">{link.name}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
              {/* <li className="mt-auto">
                <a
                  href="#"
                  className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-400 hover:bg-gray-800 hover:text-white"
                >
                  <Cog6ToothIcon
                    className="h-6 w-6 shrink-0"
                    aria-hidden="true"
                  />
                  Settings
                </a>
              </li> */}
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
