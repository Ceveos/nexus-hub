import prisma from "@/lib/prisma";
import CommunityCard from "../(components)/communityCard";
import CardContainer from "../(components)/cardContainer";
import CreateCommunityCard from "../(components)/createCommunityCard";
import CreateCommunityModal from "../(components)/createCommunity";
import { getServerAuthSession } from "@/lib/auth";
import CreateCommunityButton from "../(components)/createCommunityButton";
import SectionHeading from "../(components)/sectionHeading";
// import WebsocketTest from "../(components)/websocketTest";

export default async function Page() {
  const session = await getServerAuthSession();
  const communities = await prisma.community.findMany({
    where: {
      members: {
        some: {
          userId: session?.user.id
        }
      }
    }
  });

  return <>
    <SectionHeading action={createButton} >Communities</SectionHeading>
    <CardContainer>
      {communities.map(community  => (
        <CommunityCard key={community.id} community={community} />
      ))}
      <CreateCommunityCard>
        <CreateCommunityModal/>
      </CreateCommunityCard>
    </CardContainer>
    {/* <pre>{JSON.stringify(session, null, 2)}</pre> */}
    {/* <WebsocketTest /> */}
  </>;
}

const createButton = (
  <CreateCommunityButton>
    <CreateCommunityModal/>
  </CreateCommunityButton>
);
