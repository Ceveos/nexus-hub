import prisma from "@nextjs/lib/prisma";
import CommunityCard from "../../(components)/communityCard";
import CardContainer from "@nextjs/components/dashboard/cardContainer";
import { getServerAuthSession } from "@nextjs/lib/auth";
import SectionHeading from "@nextjs/components/dashboard/sectionHeading";
import DashboardContent from "@nextjs/components/dashboard/dashboardContent";
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
    <DashboardContent>
      <SectionHeading>Overview</SectionHeading>
      <CardContainer>
        {communities.map(community => (
          <CommunityCard key={community.id} community={community} />
        ))}
      </CardContainer>
    </DashboardContent>
    {/* <pre>{JSON.stringify(session, null, 2)}</pre> */}
    {/* <WebsocketTest /> */}
  </>;
}


