"use client";
import { type ReactNode, useState } from "react";
import Sidebar from "./sidebar";
import Navbar from "./navbar";

import { type NavigationLink } from "@nextjs/types/Navigation";
import { cn } from "@nextjs/lib/utils";

export interface SidebarProps {
  header?: React.ReactNode;
  userNavigationLinks: JSX.Element;
  navigationLinks: NavigationLink[];
  externalLinks: NavigationLink[];
}

type Props = {
  children: ReactNode;
  sidebarProps: SidebarProps;
  navbarAvatar: ReactNode;
  content?: {
    className?: string;
  }
};

export default function Dashboard({ content, sidebarProps, children, navbarAvatar, }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
        <Sidebar
          header={sidebarProps.header}
          navigationLinks={sidebarProps.navigationLinks}
          externalLinks={sidebarProps.externalLinks}
          open={sidebarOpen}
          setOpen={setSidebarOpen}
        />

        <div className={cn("lg:pl-72 h-full flex flex-col", content && content.className)}>
          <Navbar
            userNavigation={sidebarProps.userNavigationLinks}
            setSidebarOpen={setSidebarOpen}
            navbarAvatar={navbarAvatar}
          />
          {children}
        </div>
    </>
  );
}