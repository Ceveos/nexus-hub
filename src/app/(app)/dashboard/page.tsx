import { getServerSession } from "next-auth/next";
import { authOptions } from "~/server/auth";
// import WebsocketTest from "../(components)/websocketTest";

export default async function Page() {
  const session = await getServerSession(authOptions);
  return <>
    <pre>{JSON.stringify(session, null, 2)}</pre>
    {/* <WebsocketTest /> */}
  </>;
}
