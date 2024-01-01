import prisma from "@/lib/prisma";
import CommunityCard from "../(components)/communityCard";
import CardContainer from "../(components)/cardContainer";
import { getServerAuthSession } from "@/lib/auth";
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
    <SectionHeading>Overview</SectionHeading>
    <CardContainer>
      {communities.map(community  => (
        <CommunityCard key={community.id} community={community} />
      ))}
    </CardContainer>
    {/* <pre>{JSON.stringify(session, null, 2)}</pre> */}
    {/* <WebsocketTest /> */}
  </>;
}


