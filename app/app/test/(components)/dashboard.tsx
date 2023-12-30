"use client";
import { type ReactNode, useState } from "react";

import Sidebar from "./sidebar";
import Navbar from "./navbar";

import { dashboardLinks, externalLinks } from "../(data)/navLinks";
import { communityLinks, userNavigationLinks } from "../(data)/navLinks.client";
import { useParams, useSelectedLayoutSegment } from "next/navigation";


type Props = {
  children: ReactNode;
  navbarAvatar: ReactNode;
};

export default function Dashboard({ children, navbarAvatar, }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const segment = useSelectedLayoutSegment();
  const { id } = useParams() as { id: string };

  return (
    <>
      <div>
        {segment === "community" && id ? (
          <Sidebar
            navigationLinks={communityLinks(id)}
            externalLinks={externalLinks}
            open={sidebarOpen}
            setOpen={setSidebarOpen}
          />
        ) : (
          <Sidebar
            navigationLinks={dashboardLinks}
            externalLinks={externalLinks}
            open={sidebarOpen}
            setOpen={setSidebarOpen}
          />
        )}

        <div className="lg:pl-72">
          <Navbar
            userNavigation={userNavigationLinks}
            setSidebarOpen={setSidebarOpen}
            navbarAvatar={navbarAvatar}
          />
          {children}
        </div>
      </div>
    </>
  );
}