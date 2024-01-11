import { type ReactNode } from "react";
import SettingsTabs, { type Tab } from "@nextjs/components/dashboard/tabs";
import DashboardContent from "@nextjs/components/dashboard/dashboardContent";

const tabs: Tab[] = [
  { name: "General" },
  // { name: "Profile", segment: "profile" },
  // { name: "Account", segment: "account" },
];

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <DashboardContent>
      <SettingsTabs tabs={tabs} />
      {children}
    </DashboardContent>
  );
};

export default DashboardLayout;
