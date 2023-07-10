"use client";
import { useState } from "react";
import {
  HomeIcon,
  UsersIcon,
  FolderIcon,
  CalendarIcon,
  DocumentDuplicateIcon,
  ChartPieIcon,
} from "@heroicons/react/24/outline";
import { type DropdownLink, type NavigationLink } from "~/types";
import Sidebar from "./sidebar";
import Navbar from "./navbar";

const navigation: NavigationLink[] = [
  { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
  { name: "Servers", href: "#", icon: UsersIcon },
  { name: "Staff", href: "#", icon: FolderIcon },
  { name: "Tickets", href: "#", icon: CalendarIcon },
  { name: "Documents", href: "#", icon: DocumentDuplicateIcon },
  { name: "Reports", href: "#", icon: ChartPieIcon },
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

export default function Dashboard({ children }: { children: React.ReactNode }) {
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
          />
          <main className="py-10">
            <div className="px-4 sm:px-6 lg:px-8">{children}</div>
          </main>
        </div>
      </div>
    </>
  );
}
