"use client";

import { api } from "../../../convex/_generated/api";
import { InputTask } from "@/components/input-task";
import { DataTable } from "@/components/data-table";
import { columns } from "./task-columns";
import { Header } from "@/components/header";
import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";

export default function Page() {
  const { data, isPending, error } = useQuery(convexQuery(api.tasks.get, {}));

  if (!data) {
    return <p>Loading...</p>;
  }

  console.log(data);

  return (
    <>
      <Header breadcrumbs={[]} currentPage="Dashboard" />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 p-8 md:min-h-min">
          <InputTask />
          {isPending ? (
            <p>Loading...</p>
          ) : (
            <DataTable columns={columns} data={data} />
          )}
        </div>
      </div>
    </>
  );
}
