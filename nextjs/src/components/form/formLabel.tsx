"use client";

import { cn } from "@nextjs/lib/utils";
import { type InputHTMLAttributes } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  className?: string;
};

const FormLabel: React.FC<Props> = ({ label, name, className }) => {
  return (
    <label htmlFor={name} className={cn("block text-sm font-medium leading-6 text-gray-900", className)}>
    {label}
  </label>
  )
}

export default FormLabel;