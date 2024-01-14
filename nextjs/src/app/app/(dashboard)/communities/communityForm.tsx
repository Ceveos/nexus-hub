'use client';

import CommunityCard from "../../(components)/communityCard";
import CardContainer from "@nextjs/components/dashboard/cardContainer";
import CreateCommunityCard from "../../(components)/createCommunityCard";
import CreateCommunityButton from "../../(components)/createCommunityButton";
import SectionHeading from "@nextjs/components/dashboard/sectionHeading";
import { type Community } from "@prisma/client";
import { useState } from "react";
import CreateCommunityModal from "../../(components)/createCommunityModal";

export default function CommunityForm({ communities }: { communities: Community[] }) {
  const [isOpen, setIsOpen] = useState(false);

  return <>
    <SectionHeading action={<CreateCommunityButton setIsOpen={setIsOpen} />}>Communities</SectionHeading>
    <CardContainer>
      {communities.map(community => (
        <CommunityCard key={community.id} community={community} />
      ))}
      <CreateCommunityCard setIsOpen={setIsOpen} />
    </CardContainer>
    <CreateCommunityModal isOpen={isOpen} setIsOpen={setIsOpen} />
  </>;
}