import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

type Props = {
  children: ReactNode;
  main?: {
    className?: string;
  }
  content?: {
    className?: string;
  }
};

export default function DashboardContent({ children, main, content }: Props) {
  return (
    <main className={cn("py-5 overflow-auto flex-1", main && main.className)}>
      <div className={cn("px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto", content && content.className)}>{children}</div>
    </main>
  );
}