import { ClientSidebar } from "@/components/client-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function ClientDashboardLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <ClientSidebar />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
