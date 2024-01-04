"use client";

import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

export interface FormProps{
  className?: string
  children: ReactNode;
};


const Form: React.FC<FormProps> = ({
  className,
  children,
}) => {
  return (
    <div className={cn("divide-y divide-gray-200", className)}>
      {children}
    </div>
  )
}

export default Form;