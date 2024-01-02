"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";
import { ModalProvider } from "@/components/modal/provider";
import { ReduxProvider } from "./reduxProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider baseUrl={process.env.NEXTAUTH_URL}>
      <ReduxProvider>
        <Toaster className="dark:hidden" position="top-right" />
        <Toaster theme="dark" className="hidden dark:block" position="top-right" />
        <ModalProvider>{children}</ModalProvider>
      </ReduxProvider>
    </SessionProvider>
  );
}
