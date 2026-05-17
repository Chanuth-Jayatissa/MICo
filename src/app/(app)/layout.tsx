import Sidebar from "@/components/layout/Sidebar";
import AppProviders from "@/components/layout/AppProviders";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppProviders>
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="ml-20 flex-1 overflow-y-auto">
          <div className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
            {children}
          </div>
        </main>
      </div>
    </AppProviders>
  );
}
