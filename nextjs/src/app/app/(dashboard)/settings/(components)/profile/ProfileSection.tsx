
import { getServerAuthSession } from "@nextjs/lib/auth";
import ProfileForm from "./ProfileForm";
import React from "react";

export default async function ProfileSection() {
  const session = await getServerAuthSession();
  if (!session) {
    return null;
  }
  return (
    <ProfileForm
      defaultValues={{
        name: session.user.name ?? "",
        email: session.user.email ?? ""
      }}
      avatar={session.user.image ?? ""}
    />
  );
}
