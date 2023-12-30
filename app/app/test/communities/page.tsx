import prisma from "@/lib/prisma";
import CommunityCard from "../(components)/communityCard";
import CardContainer from "../(components)/cardContainer";
import CreateCommunityCard from "../(components)/createCommunityCard";
import { getServerAuthSession } from "@/lib/auth";
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
    <CardContainer>
      {communities.map(community  => (
        <CommunityCard key={community.id} community={community} />
      ))}
      <CreateCommunityCard />
    </CardContainer>
    {/* <pre>{JSON.stringify(session, null, 2)}</pre> */}
    {/* <WebsocketTest /> */}
  </>;
}
