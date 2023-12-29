import { type ReactNode } from "react";
import Dashboard from "./(components)/dashboard";
import NavbarAvatar from "./(components)/navbar.avatar.component";
import DashboardContent from "./(components)/dashboardContent";
import { Providers } from "../(providers)/providers";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="h-full bg-white">
      <title>Nexus Hub - Dashboard</title>
      <Providers>
        <Dashboard navbarAvatar={<NavbarAvatar />}>
          <DashboardContent>{children}</DashboardContent>
        </Dashboard>
      </Providers>
    </div>
  );
};

export default DashboardLayout;
