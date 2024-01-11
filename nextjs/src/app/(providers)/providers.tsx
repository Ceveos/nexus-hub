"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";
import { ModalProvider } from "@nextjs/components/modal/provider";
import { ThemeProvider } from "next-themes";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class">
      <SessionProvider baseUrl={process.env.NEXTAUTH_URL}>
        <Toaster className="dark:hidden" />
        <Toaster theme="dark" className="hidden dark:block" />
        <ModalProvider>{children}</ModalProvider>
      </SessionProvider>
    </ThemeProvider>
  );
}
