"use client"

import {
  Cog6ToothIcon,
  ArrowLeftCircleIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import { type DropdownItem, type NavigationLink } from "@/types";
import { signOut } from "next-auth/react";


export const communityLinks = (communityId: string): NavigationLink[] => [
  { name: "Back to communities", href: "communities", icon: ArrowLeftCircleIcon, relative: true },
  { name: "Overview", href: `community/${communityId}`, icon: ChartBarIcon, isActive: (segments) => segments.length == 2 && segments[1] === communityId, segmentIndex: 1, relative: true },
  { name: "Community Settings", href: `community/${communityId}/settings`, icon: Cog6ToothIcon, segment: 'settings', segmentIndex: 2, relative: true },
];

export const userNavigationLinks: DropdownItem[] = [
  { name: "Settings", href: "/test/settings" },
  { name: "Sign out", action: () => { void signOut({callbackUrl: '/', redirect: true})} },
];
