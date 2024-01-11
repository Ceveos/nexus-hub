"use server";

import {
  HomeIcon,
  Cog6ToothIcon,
  UserGroupIcon,
  ArrowLeftCircleIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import { type NavigationLink } from "@nextjs/types/Navigation";

export async function dashboardLinks(): Promise<NavigationLink[]> {
  return Promise.resolve([
    { name: "Home", href: "dashboard", icon: <HomeIcon />, segment: "dashboard", relative: true },
    { name: "Communities", href: "communities", icon: <UserGroupIcon />, segment: "communities", relative: true },
    { name: "Settings", href: "settings", icon: <Cog6ToothIcon />, segment: "settings", relative: true },
  ]);
} 

export async function communityLinks(): Promise<NavigationLink[]> {
  return Promise.resolve([
    { name: "Back to communities", href: "../../communities", icon: <ArrowLeftCircleIcon />, relative: true },
    { name: "Overview", href: "/", icon: <ChartBarIcon />, segment: null, relative: true },
    { name: "Community Settings", href: "settings", icon: <Cog6ToothIcon />, segment: 'settings', segmentIndex: 0, relative: true },
  ]);
} 

export async function externalLinks(): Promise<NavigationLink[]> {
  return Promise.resolve([
    { name: "Discord", href: "https://discord.gg/nhaqfGvH8W", initial: "D" },
    // { name: "Tailwind Labs", href: "#", initial: "T" },
    // { name: "Workcation", href: "#", initial: "W" },
  ]);
} 

