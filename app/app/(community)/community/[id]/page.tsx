import Section from "@/components/dashboard/section";
import SectionHeading from "@/components/dashboard/sectionHeading";
import { Stat, StatSet } from "@/components/dashboard/stats";
import { ServerIcon } from "@heroicons/react/24/outline";
// import { getServerAuthSession } from "@/lib/auth";
// import WebsocketTest from "../(components)/websocketTest";

export default function Page() {
  // const session = await getServerAuthSession();


  return <>
    <Section>
      <SectionHeading>Overview</SectionHeading>
      <StatSet>
        <Stat id="users" name="Users" stat="0" icon={ServerIcon} />
        <Stat id="users" name="Users" stat="0" icon={ServerIcon} />
        <Stat id="users" name="Users" stat="0" icon={ServerIcon} />
      </StatSet>
    </Section>
  </>;
}
