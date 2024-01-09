
import { getCommunityDataById } from "@/lib/fetchers";
import React from "react";
import { notFound } from "next/navigation";
import DomainForm from "./DomainForm";


interface Props {
  communityId: string;
};

const DomainSection: React.FC<Props> = async ({
  communityId
}) => {
  const data = await getCommunityDataById(communityId);
  if (!data) {
    notFound();
  }

  return (
    <DomainForm
      defaultValues={{
        id: communityId,
        customDomain: data.customDomain ?? undefined,
      }}
      customDomain={data.customDomain ?? undefined}
    />
  );
}

export default DomainSection