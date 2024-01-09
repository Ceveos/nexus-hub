"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateCommunity } from "@/lib/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { type Community } from "@prisma/client";
import FormSection from "@/components/form/formSection";
import { type GeneralFormData, GeneralSchema } from "@/lib/schemas/community/generalSchema";
import { env } from "@/env.mjs";
import { useEffect } from "react";
import { ErrorMessage, Field, Fieldset, Label } from "@/components/catalyst/fieldset";
import { Input } from "@/components/catalyst/input";
import { Textarea } from "@/components/catalyst/textarea";

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
        if (result.errorField as keyof typeof errors) {
          setError(result.errorField as "name" | "subdomain" | "description", {
            message: result.message,
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
      <Fieldset className={"col-span-full sm:max-w-md"}>
        <Field>
          <Label htmlFor="name">Name</Label>
          <Input data-invalid={errors["name"]} autoComplete="off" id="name" {...register("name")} />
          {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
        </Field>
        <Field className={"mt-6"}>
          <Label htmlFor="subdomain">Subdomain</Label>
          <Input
            data-invalid={errors["subdomain"]}
            id="subdomain"
            prefix="https://"
            postfix={`.${env.NEXT_PUBLIC_ROOT_DOMAIN}`}
            autoCapitalize="off"
            pattern="[a-zA-Z0-9\-]+" // only allow lowercase letters, numbers, and dashes
            maxLength={32}
            {...register("subdomain")}
          />
          {errors.subdomain && <ErrorMessage>{errors.subdomain.message}</ErrorMessage>}
        </Field>
        <Field className={"mt-6"}>
          <Label htmlFor="description">Description</Label>
          <Textarea data-invalid={errors["description"]} id="description" rows={4} {...register("description")} />
          {errors.description && <ErrorMessage>{errors.description.message}</ErrorMessage>}
        </Field>
      </Fieldset>
    </FormSection>
  );
}

export default GeneralForm;