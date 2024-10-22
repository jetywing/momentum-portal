"use client";

import { AdminSidebar } from "@/components/admin-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Card } from "@/components/ui/card";
import { CircleSlash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export default function AdminDashboardLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  const user = useQuery(api.functions.currentUser);
  const role = user?.roles;

  if (!role?.includes("admin")) {
    return (
      <div className="flex h-screen w-full items-center justify-center px-4">
        <Card className="p-8 flex flex-col gap-4 justify-center">
          <Progress value={99} className="w-36" />
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
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
