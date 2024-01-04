"use client";

import { cn } from "@/lib/utils";
import { type InputHTMLAttributes } from "react";
import { type FieldErrors, type FieldValues } from "react-hook-form";
import { type UseFormRegisterReturn } from "react-hook-form";
import FormLabel from "./formLabel";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  prefix?: string;
  errors: FieldErrors<FieldValues>
  register: UseFormRegisterReturn;
};

const FormInputText: React.FC<Props> = ({ label, className, prefix, register, errors, ...inputprops }) => {
  return (
    <div className="col-span-full">
      <FormLabel name={register.name} label={label} />
      <div className="mt-2">
        <div className={cn(errors[register.name] && "border border-red-600", "flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md")}>
          {prefix && (<span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">{prefix}</span>)}
          <input
            type="text"
            id={register.name}
            className={cn("block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6", className)}
            {...register}
            {...inputprops}
          />
        </div>
        {errors[register.name] && <span className="error text-red-600">{errors[register.name]?.message?.toString()}</span>}
      </div>
    </div>
  )
}

export default FormInputText;