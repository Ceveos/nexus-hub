"use client";

import { cn } from "@nextjs/lib/utils";
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
    <div className={cn("divide-y divide-primary-300 dark:divide-primary-dark-700", className)}>
      {children}
    </div>
  )
}

export default Form;