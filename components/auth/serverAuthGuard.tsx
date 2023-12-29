import { type ReactNode } from "react";
import { redirect } from "next/navigation";
import { getServerAuthSession } from "@/lib/auth";

type Props = {
  children: ReactNode;
};

const ServerAuthGuard = async ({ children }: Props) => {
  const session = await getServerAuthSession();

  if (!session) {
    redirect("/api/auth/signin");
  }
  return <>{children}</>;
};

export default ServerAuthGuard;
