"use client";

import { type DropdownItem } from "@/types";
import { signOut } from "next-auth/react";

export const userNavigationLinks: DropdownItem[] = [
  { name: "Settings", href: "/test/settings" },
  { name: "Sign out", action: () => { void signOut({ callbackUrl: '/', redirect: true }) } },
]