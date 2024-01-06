"use client"

import { useModal } from "@/components/modal/provider";
import SectionHeadingButton from "./sectionHeadingButton";

// eslint-disable-next-line @typescript-eslint/ban-types
type Props = {
  children: React.ReactNode;
};

export default function CreateCommunityButton({children}: Props) {
  const modal = useModal();

  return (
    <SectionHeadingButton action={() => modal?.show(children)}>Create</SectionHeadingButton>
  );
}
