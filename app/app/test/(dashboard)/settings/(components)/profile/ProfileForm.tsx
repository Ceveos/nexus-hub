"use client";

import { useForm } from "react-hook-form";
import FormSection from "../../../../(components)/form/formSection";
import { zodResolver } from "@hookform/resolvers/zod";
// import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { updateUser } from "@/lib/actions";
import { type UserFormData, UserSchema } from "@/lib/schemas/userSchema";
import { toast } from "sonner";
import FormInputText from "@/app/app/test/(components)/form/formInput.Text";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface Props {
  defaultValues: UserFormData;
}

const  ProfileForm: React.FC<Props> = ({defaultValues}) => {
  const { update } = useSession()
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<UserFormData>({
    resolver: zodResolver(UserSchema),
    defaultValues
  });

  const onSubmit = async (data: UserFormData): Promise<void> => {
    try {
      await updateUser(data);
      await update();
      router.refresh();
      toast.success("Your profile has been updated.");
    } catch (error) {
      setError("root", {
        message: "An unknown error occurred.",});
      toast.error("An unknown error occurred.");
      // if (error instanceof PrismaClientKnownRequestError) {
      //   setError("root.serverError", {
      //     message: error.message,
      //   })
      // } else {
      //   setError("root.serverError", {
      //     message: "An unknown error occurred.",
      //   })
      // }
    }
  };

  return (
    <FormSection
      title="Profile"
      description="This information will be displayed publicly so be careful what you share."
      onSubmit={handleSubmit(onSubmit)}
      errors={errors}
    >
      <FormInputText
        label="Name"
        errors={errors}
        register={register("name")}
      />
    </FormSection>
  );
}

export default ProfileForm;