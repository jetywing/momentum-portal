"use client";

import { AdminSidebar } from "@/components/admin-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Card } from "@/components/ui/card";
import { AdminCommandMenu } from "@/components/admin-command";
import { LoaderCircle } from "lucide-react";
import { Toaster } from "sonner";

export default function AdminDashboardLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  const user = useQuery(api.functions.currentUser);
  const role = user?.roles;

  // TODO: an implementation of this that isn't awful
  // add timeout that redirects and/or shows access denied.
  if (!role?.includes("admin")) {
    return (
      <div className="flex h-screen w-full items-center justify-center px-4">
        <Card className="flex flex-col justify-center gap-4 border-none p-8">
          <LoaderCircle className="animate-spin" />
          {/* <div className="flex items-center flex-row gap-2 align-middle"> */}
          {/*   <CircleSlash size={36} /> */}
          {/*   <p className="text-2xl md:text-4xl text-red-600 font-bold"> */}
          {/*     Access denied */}
          {/*   </p> */}
          {/* </div> */}
          {/* <Button asChild variant={"secondary"}> */}
          {/*   <a href="/">Go Back</a> */}
          {/* </Button> */}
        </Card>
      </div>
    );
  }

  return (
    <>
      <AdminCommandMenu />
      <SidebarProvider>
        <AdminSidebar />
        <SidebarInset>{children}</SidebarInset>
        <Toaster />
      </SidebarProvider>
    </>
  );
}
