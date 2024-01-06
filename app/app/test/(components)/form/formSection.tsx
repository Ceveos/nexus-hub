"use client";

import { type FormHTMLAttributes, type ReactNode } from "react";
import { type FieldErrors, type FieldValues } from "react-hook-form";

export interface FormSectionProps extends FormHTMLAttributes<HTMLFormElement> {
  title: string;
  description: string;
  errors: FieldErrors<FieldValues>
  children: ReactNode;
};


const FormSection: React.FC<FormSectionProps> = ({
  title,
  description,
  errors,
  children,
  ...formProps
}) => {
  return (
    <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
      <div>
        <h2 className="text-base font-semibold leading-7 text-gray-900">{title}</h2>
        <p className="mt-1 text-sm leading-6 text-gray-600">
          {description}
        </p>
      </div>
      <form className="md:col-span-2" {...formProps}>
        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
          {children}
        </div>
        <div className="mt-8">
          <button
            type="submit"
            className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          >
            Save
          </button>
          {errors["root"] && <div className="mt-2"><span className="error text-red-600">{errors["root"]?.message?.toString()}</span></div>}

        </div>
      </form>
    </div>
  )
}

export default FormSection;