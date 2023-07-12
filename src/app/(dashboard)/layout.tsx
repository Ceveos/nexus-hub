import { type ReactNode } from "react";
import { type Session } from "next-auth";
import Dashboard from "./(components)/dashboard";
import NavbarAvatar from "./(components)/navbar.avatar.component";

type Props = {
  children: ReactNode;
  session: Session | null;
};

const DashboardLayout = ({ children }: Props) => {
  return (
    <div className="h-full bg-white">
      <title>Helios Hub - Dashboard</title>
      <Dashboard navbarAvatar={<NavbarAvatar />}>{children}</Dashboard>
    </div>
  );
};

export default DashboardLayout;
