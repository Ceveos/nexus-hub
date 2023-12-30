import {
  HomeIcon,
  Cog6ToothIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { type NavigationLink } from "@/types";

export const dashboardLinks: NavigationLink[] = [
  { name: "Home", href: "dashboard", icon: HomeIcon, segment: "dashboard", relative: true },
  { name: "Communities", href: "communities", icon: UserGroupIcon, segment: "communities", relative: true },
  { name: "Settings", href: "settings", icon: Cog6ToothIcon, segment: "settings", relative: true },
];

export const externalLinks: NavigationLink[] = [
  { name: "Discord", href: "https://google.com", initial: "D" },
  { name: "Tailwind Labs", href: "#", initial: "T" },
  { name: "Workcation", href: "#", initial: "W" },
];