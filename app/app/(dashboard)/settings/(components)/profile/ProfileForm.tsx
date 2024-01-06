"use client";

import { useForm } from "react-hook-form";
import FormSection from "../../../../(components)/form/formSection";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateUser } from "@/lib/actions";
import { type UserFormData, UserSchema } from "@/lib/schemas/userSchema";
import { toast } from "sonner";
import FormInputText from "@/app/app/(components)/form/formInput.Text";
import { getSession, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import FormInputAvatar from "@/app/app/(components)/form/formInputAvatar";
import { supabaseInstance } from "@/lib/supabase";
import { v4 as uuidv4 } from "uuid";
import { type User } from "@prisma/client";

interface Props {
  defaultValues: UserFormData;
  avatar: string;
}

const ProfileForm: React.FC<Props> = ({ avatar, defaultValues }) => {
  const { update } = useSession()
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    formState: { errors }
  } = useForm<UserFormData>({
    resolver: zodResolver(UserSchema),
    defaultValues
  });

  const onSubmit = async (data: UserFormData): Promise<void> => {
    const userFields: Partial<User> = {
      name: data.name,
    }

    try {
      if (data.avatar?.file) {
        const session = await getSession();
        const extension = data.avatar.file.name.split('.').pop(); // Get the file extension
        const uniqueFileName = `${uuidv4()}.${extension}`;

        if (!session || !session.supabaseAccessToken) {
          throw new Error("Supabase access token not found.");
        }

        const supabase = supabaseInstance(session.supabaseAccessToken);
        const { data: result, error } = await supabase
          .storage
          .from("avatars")
          .upload(`public/${session?.user.id}/${uniqueFileName}`, data.avatar.file);

        if (error) {
          console.log(error);
          setError("root", {
            message: error.message
          });
          return;
        }
        
        userFields.image = supabase.storage.from("avatars").getPublicUrl(result.path).data.publicUrl;
      }

      // Avatar is a blob file; remove it if it exists.
      delete data.avatar;
      const result = await updateUser(userFields);

      if (result.success) {
        await update();
        router.refresh();
        toast.success("Your profile has been updated.");
      } else {
        setError("root", {
          message: result.message
        });
      }
    } catch (error) {
      console.log(error);
      setError("root", {
        message: "An unknown error occurred.",
      });
      toast.error("An unknown error occurred.");
    }
  };

  return (
    <FormSection
      title="Profile"
      description="This information will be displayed publicly so be careful what you share."
      onSubmit={handleSubmit(onSubmit)}
      errors={errors}
    >
      <FormInputAvatar
        image={avatar}
        error={errors.avatar?.file}
        setValue={setValue}
        register={register("avatar")}
      />
      <FormInputText
        label="Name"
        errors={errors}
        register={register("name")}
      />
      <FormInputText
        label="Email"
        errors={errors}
        register={register("email")}
      />
    </FormSection>
  );
}

export default ProfileForm;