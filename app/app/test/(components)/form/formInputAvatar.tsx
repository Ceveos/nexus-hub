import { cn } from "@/lib/utils";
import { XCircleIcon } from "@heroicons/react/20/solid";
import Image from "next/image";
import { useState } from "react";
import { type UseFormSetValue, type UseFormRegisterReturn, type FieldError } from "react-hook-form";

interface Props {
  image: string;
  error?: FieldError
  register: UseFormRegisterReturn;
  setValue: UseFormSetValue<any>
};

const FormInputAvatar: React.FC<Props> = ({ image, error, register, setValue }) => {
  const [imagePreviewUrl, setImagePreviewUrl] = useState(image);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (fileList && fileList.length > 0) {
      const file = fileList[0];
      setValue(register.name, { file }, { shouldValidate: true });
      setImagePreviewUrl(URL.createObjectURL(file!));
    }
  };

  return (
    <>
      <div className="col-span-full flex items-center gap-x-8">
        <Image
          src={imagePreviewUrl}
          alt="Avatar"
          width={96}
          height={96}
          className={cn(
            error && "border-2 border-red-600",
            "h-24 w-24 flex-none rounded-full bg-gray-200 object-cover")}
        />
        <div>
          <label
            className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
            htmlFor={register.name}
          >
            Change avatar
          </label>
          <input
            id={register.name}
            type="file"
            className="hidden"
            accept="image/png, image/jpeg, image/gif image/webp"
            {...register}
            onChange={handleFileChange}
          >

          </input>
          <p className={cn("mt-2 text-xs leading-5 text-gray-500", error && "text-red-600")}>PNG, JPG, WEBP, or GIF. 1MB max.</p>
        </div>
      </div>

      {error && (
        <div className="col-span-full -mt-4 border-l-4 border-red-400 bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                {error?.message?.toString()}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default FormInputAvatar;