import { type ReactNode } from "react";

const AppLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="bg-black h-full">
      {children}
    </div>
  );
};

export default AppLayout;
