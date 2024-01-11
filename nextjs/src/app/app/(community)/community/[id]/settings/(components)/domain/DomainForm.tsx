"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateCommunity } from "@nextjs/lib/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { type Community } from "@prisma/client";
import FormSection from "@nextjs/components/form/formSection";
import { type DomainFormData, DomainSchema } from "@nextjs/lib/schemas/community/domainSchema";
import DomainConfiguration from "@nextjs/components/form/domain-configuration";
import DomainStatus from "@nextjs/components/form/domain-status";
import { ErrorMessage, Field, Fieldset, Label } from "@nextjs/components/catalyst/fieldset";
import { Input } from "@nextjs/components/catalyst/input";

interface Props {
  defaultValues: DomainFormData;
  customDomain?: string;
}

const DomainForm: React.FC<Props> = ({ customDomain, defaultValues }) => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setError,
    watch,
    formState: { errors }
  } = useForm<DomainFormData>({
    resolver: zodResolver(DomainSchema),
    defaultValues
  });
  const currentDomain = watch("customDomain");

  const onSubmit = async (data: DomainFormData): Promise<void> => {
    const communityFields: Partial<Community> = {
      id: data.id,
      customDomain: data.customDomain === "" ? null : data.customDomain,
    }
    try {
      const result = await updateCommunity(communityFields);

      if (result.success) {
        router.refresh();
        toast.success(`Domain has been updated.`);
      } else {
        if (result.errorField as keyof typeof errors) {
          setError(result.errorField as "customDomain", {
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
    <>
      <FormSection
        title="Domain"
        description="Customize your community's domain"
        onSubmit={handleSubmit(onSubmit)}
        errors={errors}
      >
  <Fieldset className={"col-span-full sm:max-w-md"}>
        <Field>
          <Label htmlFor="customDomain">Domain</Label>
          <Input
            id="customDomain"
            data-invalid={errors["customDomain"]}
            autoComplete="off"
            prefix="https://"
            postfix={(customDomain && customDomain === currentDomain) ? <div className="z-10 flex h-2 items-center"><DomainStatus domain={customDomain} /></div> : undefined}
            {...register("customDomain")} />
          {errors.customDomain && <ErrorMessage>{errors.customDomain.message}</ErrorMessage>}
        </Field>
        </Fieldset>
      </FormSection>
      {customDomain && customDomain === currentDomain && <DomainConfiguration domain={customDomain} />}
    </>
  );
}

export default DomainForm;