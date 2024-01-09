import prisma from "@/lib/prisma";
import { getServerAuthSession } from "@/lib/auth";
import CommunityForm from "./communityForm";

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
    <CommunityForm communities={communities}/>
  </>;
}