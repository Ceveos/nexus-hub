import { getServerSession } from "next-auth/next";
import { authOptions } from "~/server/auth";
import { prisma } from "~/server/db";
import CommunityCard from "./(components)/communityCard";
import CardContainer from "./(components)/cardContainer";
import CreateCommunityCard from "./(components)/createCommunityCard";
// import WebsocketTest from "../(components)/websocketTest";

export default async function Page() {
  const session = await getServerSession(authOptions);
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
      {communities.map(community => (
        <CommunityCard key={community.id} community={community} />
      ))}
      <CreateCommunityCard />
    </CardContainer>
    {/* <pre>{JSON.stringify(session, null, 2)}</pre> */}
    {/* <WebsocketTest /> */}
  </>;
}
