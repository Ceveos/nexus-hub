"use client"

import SectionHeadingButton from "@nextjs/components/dashboard/sectionHeadingButton";

interface Props {
  setIsOpen: (isOpen: boolean) => void;
}

export default function CreateCommunityButton({ setIsOpen }: Props) {

  return (<>
    <SectionHeadingButton action={() => setIsOpen(true)}>Create</SectionHeadingButton>
  </>
  );
}
