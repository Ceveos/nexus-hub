import { type ReactNode } from "react";
import Dashboard from "./(components)/dashboard";
import NavbarAvatar from "./(components)/navbar.avatar.component";
import DashboardContent from "./(components)/dashboardContent";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="h-full bg-white">
      <title>Helios Hub - Dashboard</title>
      <Dashboard navbarAvatar={<NavbarAvatar />}>
        <DashboardContent>{children}</DashboardContent>
      </Dashboard>
    </div>
  );
};

export default DashboardLayout;
