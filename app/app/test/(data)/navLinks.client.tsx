"use client"

import {
  Cog6ToothIcon,
  ArrowLeftCircleIcon,
} from "@heroicons/react/24/outline";
import { type DropdownItem, type NavigationLink } from "@/types";
import { signOut } from "next-auth/react";


export const communityLinks = (communityId: string): NavigationLink[] => [
  { name: "Back to communities", href: "communities", icon: ArrowLeftCircleIcon, relative: true },
  { name: "Overview", href: `community/${communityId}`, icon: Cog6ToothIcon, isActive: (segments) => segments.length == 2, relative: true },
  { name: "Settings", href: `community/${communityId}/settings`, icon: Cog6ToothIcon, segment: 'settings', relative: true },
];

export const userNavigationLinks: DropdownItem[] = [
  { name: "Settings", href: "/test/settings" },
  { name: "Sign out", action: () => { void signOut({callbackUrl: '/', redirect: true})} },
];
