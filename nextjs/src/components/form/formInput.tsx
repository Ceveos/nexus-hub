"use client";

import { type InputHTMLAttributes } from "react";
import { type UseFormRegisterReturn } from "react-hook-form";
import { type FieldErrors, type FieldValues } from "react-hook-form";
import FormLabel from "./formLabel";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  errors: FieldErrors<FieldValues>
  register: UseFormRegisterReturn;
};

const FormInput: React.FC<Props> = ({ label, errors, register, ...inputprops }) => {
  return (
    <div className="col-span-full">
      <FormLabel name={register.name} label={label} />
      <div className="mt-2">
        <input
          id={register.name}
          {...register}
          {...inputprops}
        />
        {errors[register.name] && <span className="error">{errors[register.name]?.message?.toString()}</span>}
      </div>
    </div>
  )
}

export default FormInput;