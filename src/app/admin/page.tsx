"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { InputTask } from "@/components/input-task";
import { DataTable } from "@/components/data-table";
import { columns } from "./task-columns";

export default function Page() {
  const tasks = useQuery(api.tasks.get);

  const data = tasks ?? [];

  return (
    <>
      <header className="flex h-16 justify-between shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbPage>Dashboard</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="px-4">
          <ThemeToggle />
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="p-8 min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
          <InputTask />
          <DataTable columns={columns} data={data} />
        </div>
      </div>
    </>
  );
}
