"use client"

import { Button } from "@/components/catalyst/button";
import { Dialog, DialogActions, DialogBody, DialogTitle } from '@/components/catalyst/dialog'
import { ErrorMessage, Field, Fieldset, Label } from '@/components/catalyst/fieldset'
import { Input } from '@/components/catalyst/input'
import { createCommunity } from "@/lib/actions";
import { type CreateCommunityFormData, CreateCommunitySchema } from "@/lib/schemas/community/createCommunitySchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { type Community } from "@prisma/client";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/catalyst/textarea";
import { env } from "@/env.mjs";

type Props = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

export default function CreateCommunityCard({ isOpen, setIsOpen }: Props) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    watch,
    reset,
    formState: { errors }
  } = useForm<CreateCommunityFormData>({
    resolver: zodResolver(CreateCommunitySchema),
    reValidateMode: "onChange",
    criteriaMode: 'firstError'
  });

  const communityName = watch("name");

  const onSubmit = async (data: CreateCommunityFormData): Promise<void> => {
    const communityFields: Pick<Community, "name" | "subdomain" | "description"> = {
      name: data.name,
      subdomain: data.subdomain,
      description: data.description ?? null,
    }

    try {
      const result = await createCommunity(communityFields);

      if (result.success) {
        toast.success(`Successfully created community!`);
        setIsOpen(false);
        router.refresh();
        router.push(`community/${result.data?.id}`);
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
  }

  useEffect(() => {
    if (communityName) {
      const subdomain = communityName.toLowerCase().replace(/\s/g, "-").replace(/[^a-z0-9-]/g, "");
      setValue("subdomain", subdomain, { shouldValidate: false });
    } else {
      setValue("subdomain", "", { shouldValidate: false });
    }
  }, [communityName, setValue])

  useEffect(() => {
    if (isOpen) {
      reset();
    }
  }, [isOpen, reset])

  return (
    <>
      <Dialog open={isOpen} onClose={setIsOpen}>
        <form onSubmit={handleSubmit(onSubmit)}>

          <DialogTitle>Create a community</DialogTitle>
          {/* <DialogDescription>
          
        </DialogDescription> */}
          <DialogBody>
            <Fieldset>
              <Field>
                <Label htmlFor="name">Name</Label>
                <Input id="name" autoComplete="off" autoFocus placeholder="My awesome community" data-invalid={errors["name"]} {...register("name")} />
                {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
              </Field>
              <Field className={"mt-6"}>
                <Label htmlFor="subdomain">Subdomain</Label>
                <Input
                  data-invalid={errors["subdomain"]}
                  id="subdomain"
                  placeholder="my-awesome-community"
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
                <Textarea id="description" placeholder="Where wonderful things happen" data-invalid={errors["description"]} {...register("description")} />
                {errors.description && <ErrorMessage>{errors.description.message}</ErrorMessage>}
              </Field>
              {errors.root && <ErrorMessage>{errors.root.message}</ErrorMessage>}
            </Fieldset>
          </DialogBody>
          <DialogActions>
            <Button plain onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button color="accent" type="submit" onClick={handleSubmit(onSubmit)}>Create</Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}
