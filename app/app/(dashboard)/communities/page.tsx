import prisma from "@/lib/prisma";
import { getServerAuthSession } from "@/lib/auth";
import CommunityForm from "./communityForm";
import DashboardContent from "@/components/dashboard/dashboardContent";

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
      <CommunityForm communities={communities} />
    </DashboardContent>
  </>;
}