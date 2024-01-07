import Form from "@/components/form/form";
import { getCommunityDataById } from "@/lib/fetchers";
import { notFound } from "next/navigation";
import GeneralSection from "./(components)/general/GeneralSection";

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
      <GeneralSection communityId={communityId} />
    </Form>
  );
}

export default Page;