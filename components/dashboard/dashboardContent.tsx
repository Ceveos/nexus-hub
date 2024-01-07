import { type ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function DashboardContent({ children }: Props) {
  return (
    <main className="py-5 flex-grow overflow-auto">
      <div className="px-4 sm:px-6 lg:px-8">{children}</div>
    </main>
  );
}
