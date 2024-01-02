import prisma from "@/lib/prisma";

export default async function Page() {
  const users = await prisma.account.findMany();
  return (
    <>
      <pre>{JSON.stringify(users, null, 2)}</pre>
    </>
  );
}
