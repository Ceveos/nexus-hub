"use client";

import { DropdownItem, DropdownSeparator } from "@nextjs/components/catalyst/dropdown";
import { signOut } from "next-auth/react";

export const userNavigationLinks: JSX.Element = (
  <>
    <DropdownItem href="/settings">Settings</DropdownItem>
    <DropdownSeparator />
    <DropdownItem onClick={() => signOut({ callbackUrl: '/', redirect: true })}>Sign out</DropdownItem>
  </>
)
