"use client";
import { type ReactNode, useState } from "react";

import Sidebar from "./sidebar";
import Navbar from "./navbar";
import { dashboardLinks, externalLinks } from "../(data)/navLinks";
import { userNavigation } from "../(data)/navLinks.client";


type Props = {
  children: ReactNode;
  navbarAvatar: ReactNode;
};

export default function Dashboard({ children, navbarAvatar }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <div>
        <Sidebar
          navigation={dashboardLinks}
          externalLinks={externalLinks}
          open={sidebarOpen}
          setOpen={setSidebarOpen}
        />

        <div className="lg:pl-72">
          <Navbar
            userNavigation={userNavigation}
            setSidebarOpen={setSidebarOpen}
            navbarAvatar={navbarAvatar}
          />
          {children}
        </div>
      </div>
    </>
  );
}
