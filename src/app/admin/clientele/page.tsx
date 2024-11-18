"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { DataTable } from "@/components/data-table";
import { columns } from "./clientele-columns";
import { Header } from "@/components/header";

export default function Page() {
  const clientele = useQuery(api.users.clienteleList);

  const data = clientele ?? [];

  return (
    <>
      <Header
        breadcrumbs={[{ title: "Dashboard", url: "/admin" }]}
        currentPage="Clientele"
      />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 p-8 md:min-h-min">
          <h1 className="text-xl font-bold md:text-3xl">Accounts</h1>
          <DataTable columns={columns} data={data} />
        </div>
      </div>
    </>
  );
}
