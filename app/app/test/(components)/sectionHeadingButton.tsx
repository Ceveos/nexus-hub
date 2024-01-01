"use client";

import { cn } from "@/lib/utils";

export interface ButtonAction {
  title: string;
  action: (target: HTMLButtonElement) => void;
}

interface Props {
  className?: string;
  children: React.ReactNode;
  action: (target: HTMLButtonElement) => void;
}

const SectionHeadingButton: React.FC<Props> = ({ children, className, action }) => {
  return (
    <div className="mt-3 sm:ml-4 sm:mt-0">
      <button
        type="button"
        onClick={(e) => action(e.currentTarget)}
        className={cn(
          "inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600",
          className
        )}
      >
        {children}
      </button>
    </div>
  );
}

export default SectionHeadingButton;
