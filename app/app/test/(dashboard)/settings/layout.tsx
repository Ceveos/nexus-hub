import { type ReactNode } from "react";
import SettingsTabs, { type Tab } from "../../(components)/tabs";

const tabs: Tab[] = [
  { name: "General" },
  { name: "Profile", segment: "profile" },
  { name: "Account", segment: "account" },
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
