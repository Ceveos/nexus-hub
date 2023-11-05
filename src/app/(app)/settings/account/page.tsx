import { prisma } from "~/server/db";

export default async function Page() {
  const users = await prisma.account.findMany();
  return (
    <>
      <pre>{JSON.stringify(users, null, 2)}</pre>
    </>
  );
}
