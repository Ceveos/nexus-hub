import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@nextjs/components/catalyst/table";
import Section from "@nextjs/components/dashboard/section";
import SectionHeading from "@nextjs/components/dashboard/sectionHeading";
// import { getServerAuthSession } from "@nextjs/lib/auth";
// import WebsocketTest from "../(components)/websocketTest";

export default function Page() {
  // const session = await getServerAuthSession();


  return <>
    <Section>
      <SectionHeading>Servers</SectionHeading>
      <Table striped>
        <TableHead>
          <TableRow>
            <TableHeader>Name</TableHeader>
            <TableHeader>Email</TableHeader>
            <TableHeader>Role</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
            <TableRow key={1} href="server/test">
              <TableCell className="font-medium">Test</TableCell>
              <TableCell>Test 2</TableCell>
              <TableCell className="text-zinc-500">Test 3</TableCell>
            </TableRow>
            <TableRow key={2} href="server/test">
            <TableCell className="font-medium">Test</TableCell>
              <TableCell>Test 2</TableCell>
              <TableCell className="text-zinc-500">Test 3</TableCell>
            </TableRow>
        </TableBody>
      </Table>
    </Section>
  </>;
}
