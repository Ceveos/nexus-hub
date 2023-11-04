import { type ReactNode } from "react";
import Dashboard from "./(components)/dashboard";
import NavbarAvatar from "./(components)/navbar.avatar.component";
import DashboardContent from "./(components)/dashboardContent";
import { ReduxProvider } from "../reduxProvider";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="h-full bg-white">
      <title>Nexus Hub - Dashboard</title>
      <ReduxProvider>
        <Dashboard navbarAvatar={<NavbarAvatar />}>
          <DashboardContent>{children}</DashboardContent>
        </Dashboard>
      </ReduxProvider>
    </div>
  );
};

export default DashboardLayout;
