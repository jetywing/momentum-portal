"use client";

import { useQuery } from "convex/react";
import { Header } from "@/components/header";
import { api } from "../../../../../convex/_generated/api";
import { columns } from "./log-columns";
import { LogsTable } from "@/components/logs-table";
import { Separator } from "@/components/ui/separator";

export default function LogsPage() {
  const logs = useQuery(api.logs.getAllLogs);

  const data = logs ?? [];

  // TODO: add a time filter

  return (
    <>
      <Header
        breadcrumbs={[
          { title: "Dashboard", url: "/admin" },
          { title: "Analytics", url: "/admin/analytics" },
        ]}
        currentPage="Logs"
      />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="min-h-[100vh] flex-1  rounded-xl bg-muted/50 p-2 md:p-8 md:min-h-min">
          <h1 className="text-xl font-bold md:text-3xl">All Logs</h1>
          <Separator className="my-4" />
          <div className="flex items-center px-4 flex-col">
            <LogsTable columns={columns} data={data} />
          </div>
        </div>
      </div>
    </>
  );
}
