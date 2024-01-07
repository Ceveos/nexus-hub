"use client";
import { type ReactNode, useState } from "react";
import Sidebar from "./sidebar";
import Navbar from "./navbar";

import { type NavigationLink } from "@/types";

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
};

export default function Dashboard({ sidebarProps, children, navbarAvatar, }: Props) {
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

        <div className="lg:pl-72">
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