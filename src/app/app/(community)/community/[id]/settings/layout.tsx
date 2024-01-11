import { type ReactNode } from "react";
import SettingsTabs, { type Tab } from "@/components/dashboard/tabs";

const tabs: Tab[] = [
  { name: "General" },
  { name: "Domain", segment: "domain" },
  // { name: "Appearance", segment: "appearance" },
];

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <SettingsTabs tabs={tabs} />
      {children}
    </>
  );
};

export default DashboardLayout;
