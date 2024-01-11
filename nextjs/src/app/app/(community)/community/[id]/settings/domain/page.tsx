import Form from "@/components/form/form";
import { getCommunityDataById } from "@/lib/fetchers";
import { notFound } from "next/navigation";
import DomainSection from "../(components)/domain/DomainSection";

interface Props {
  params: { id: string };
};

const Page: React.FC<Props> = async ({
  params
}) => {
  const communityId = decodeURIComponent(params.id);
  const data = await getCommunityDataById(communityId);

  if (!data) {
    notFound();
  }

  return (
    <Form>
      <DomainSection communityId={communityId} />
    </Form>
  );
}

export default Page;