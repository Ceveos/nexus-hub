import { getServerAuthSession } from "@/lib/auth";
// import WebsocketTest from "../(components)/websocketTest";

export default async function Page() {
  const session = await getServerAuthSession();


  return <>
    <pre>{JSON.stringify(session, null, 2)}</pre>
    {/* <WebsocketTest /> */}
  </>;
}
