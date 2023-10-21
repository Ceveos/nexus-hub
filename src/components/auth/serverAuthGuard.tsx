import { type ReactNode } from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "~/server/auth";

type Props = {
  children: ReactNode;
};

const ServerAuthGuard = async ({ children }: Props) => {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/api/auth/signin");
  }
  return <>{children}</>;
};

export default ServerAuthGuard;
