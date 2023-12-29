"use client";

import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";
import { type ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const ClientAuthGuard = ({ children }: Props) => {
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/api/auth/signin");
    },
  });

  if (status === "loading") {
    return <p>Loading....</p>;
  }

  return <>{children}</>;
};

export default ClientAuthGuard;
