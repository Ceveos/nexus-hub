import { type ReactNode } from "react";
import SettingsTabs from "./(components)/tabs";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <SettingsTabs />
      {children}
    </>
  );
};

export default DashboardLayout;
