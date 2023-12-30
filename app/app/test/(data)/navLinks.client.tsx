import {
  Cog6ToothIcon,
  ArrowLeftCircleIcon,
} from "@heroicons/react/24/outline";
import { type DropdownItem, type NavigationLink } from "@/types";
import { signOut } from "next-auth/react";


export const communityLinks = (communityId: string): NavigationLink[] => [
  { name: "Back to dashboard", href: "/test/dashboard", icon: ArrowLeftCircleIcon },
  { name: "Settings", href: `/test/community/${communityId}/settings`, icon: Cog6ToothIcon },
];

export const userNavigation: DropdownItem[] = [
  { name: "Settings", href: "/test/settings" },
  { name: "Sign out", action: () => { void signOut({callbackUrl: '/', redirect: true})} },
];
