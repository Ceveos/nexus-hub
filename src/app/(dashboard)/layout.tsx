import Dashboard from "./(components)/dashboard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full bg-white">
      <title>Helios Hub - Dashboard</title>
      <Dashboard>{children}</Dashboard>
    </div>
  );
}
