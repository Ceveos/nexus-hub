export default function LandingLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <title>Nexus Hub</title>
      <meta name="description" content="Server administration tool" />
      <link rel="icon" href="/favicon.ico" />
      {children}
    </>
  );
}
