"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateCommunity } from "@/lib/actions";
import { toast } from "sonner";
import FormInputText from "@/components/form/formInput.Text";
import { useRouter } from "next/navigation";
import { type Community } from "@prisma/client";
import FormSection from "@/components/form/formSection";
import { type DomainFormData, DomainSchema } from "@/lib/schemas/community/domainSchema";
import DomainConfiguration from "@/components/form/domain-configuration";
import DomainStatus from "@/components/form/domain-status";

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
  const currentDomain = watch("domain");

  const onSubmit = async (data: DomainFormData): Promise<void> => {
    const communityFields: Partial<Community> = {
      id: data.id,
      customDomain: data.domain === "" ? null : data.domain,
    }
    try {
      const result = await updateCommunity(communityFields);

      if (result.success) {
        router.refresh();
        toast.success(`Domain has been updated.`);
      } else {
        if (result.errorCode === "P2002") {
          setError("domain", {
            message: "This domain is already in use.",
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
        <FormInputText
          label="Domain"
          errors={errors}
          prefix="https://"
          placeholder="example.com"
          register={register("domain")}
          postfix={(customDomain && customDomain === currentDomain) ? <div className="z-10 flex h-2 items-center"><DomainStatus domain={customDomain} /></div> : undefined}
        />
      </FormSection>
      {customDomain && customDomain === currentDomain && <DomainConfiguration domain={customDomain} />}
    </>
  );
}

export default DomainForm;