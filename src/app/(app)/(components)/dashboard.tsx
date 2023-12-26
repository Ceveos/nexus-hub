"use client";
import { type ReactNode, useState } from "react";
import {
  HomeIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import { type DropdownLink, type NavigationLink } from "~/types";
import Sidebar from "./sidebar";
import Navbar from "./navbar";

const navigation: NavigationLink[] = [
  { name: "Home", href: "/dashboard", icon: HomeIcon },
  { name: "Settings", href: "/settings", icon: Cog6ToothIcon },
];
const teams: NavigationLink[] = [
  { name: "Heroicons", href: "#", initial: "H" },
  { name: "Tailwind Labs", href: "#", initial: "T" },
  { name: "Workcation", href: "#", initial: "W" },
];
const userNavigation: DropdownLink[] = [
  { name: "Your profile", href: "#" },
  { name: "Sign out", href: "#" },
];

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
          navigation={navigation}
          teams={teams}
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
