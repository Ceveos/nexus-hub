"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateCommunity } from "@/lib/actions";
import { toast } from "sonner";
import FormInputText from "@/app/app/(components)/form/formInput.Text";
import { useRouter } from "next/navigation";
import { type Community } from "@prisma/client";
import FormSection from "@/app/app/(components)/form/formSection";
import { type GeneralFormData, GeneralSchema } from "@/lib/schemas/community/generalSchema";
import FormInputTextArea from "@/app/app/(components)/form/formInput.TextArea";
import { env } from "@/env.mjs";
import { useEffect } from "react";

interface Props {
  defaultValues: GeneralFormData;
}

const GeneralForm: React.FC<Props> = ({ defaultValues }) => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    watch,
    formState: { errors }
  } = useForm<GeneralFormData>({
    resolver: zodResolver(GeneralSchema),
    defaultValues
  });

  const name = watch("name");

  useEffect(() => {
    setValue("subdomain", name.toLowerCase()
      .trim()
      .replace(/[\W_]+/g, "-"));
  }, [name, setValue]);

  const onSubmit = async (data: GeneralFormData): Promise<void> => {
    const communityFields: Partial<Community> = {
      id: data.id,
      name: data.name,
      subdomain: data.subdomain,
      description: data.description,
    }
    try {
      const result = await updateCommunity(communityFields);

      if (result.success) {
        router.refresh();
        toast.success(`${data.name} has been updated.`);
      } else {
        if (result.errorCode === "P2002") {
          setError("subdomain", {
            message: "This subdomain is already in use.",
          });
        } else {
          setError("root", {
            message: result.message,
          });
        }
      }
    } catch (error: any) {
      setError("root", {
        message: "An unknown error occurred.",
      });
      toast.error("An unknown error occurred.");
    }
  };

  return (
    <FormSection
      title="General"
      description="Basic information regarding your community."
      onSubmit={handleSubmit(onSubmit)}
      errors={errors}
    >
      <FormInputText
        label="Name"
        errors={errors}
        register={register("name")}
      />
      <FormInputText
        label="Subdomain"
        prefix="https://"
        postfix={`.${env.NEXT_PUBLIC_ROOT_DOMAIN}`}
        autoCapitalize="off"
        pattern="[a-zA-Z0-9\-]+" // only allow lowercase letters, numbers, and dashes
        maxLength={32}
        errors={errors}
        register={register("subdomain")}
      />
      <FormInputTextArea
        label="Description"
        errors={errors}
        register={register("description")}
        rows={5}
      />
    </FormSection>
  );
}

export default GeneralForm;