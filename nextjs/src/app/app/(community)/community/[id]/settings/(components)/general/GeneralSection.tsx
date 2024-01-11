
import { getCommunityDataById } from "@/lib/fetchers";
import React from "react";
import { notFound } from "next/navigation";
import GeneralForm from "./GeneralForm";


interface Props {
  communityId: string;
};

const GeneralSection: React.FC<Props> = async ({
  communityId
}) => {
  const data = await getCommunityDataById(communityId);
  if (!data) {
    notFound();
  }

  return (
    <GeneralForm
      defaultValues={{
        id: communityId,
        name: data.name,
        subdomain: data.subdomain ?? undefined,
        description: data.description ?? undefined,
      }}
    />
  );
}

export default GeneralSection