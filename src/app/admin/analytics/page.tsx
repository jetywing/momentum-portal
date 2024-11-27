"use client";

import { Header } from "@/components/header";

export default function AnaliticsPage() {
  return (
    <>
      <Header
        breadcrumbs={[{ title: "Dashboard", url: "/admin" }]}
        currentPage="Analytics"
      />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 p-8 md:min-h-min">
          <h1 className="text-xl font-bold md:text-3xl">Analytics</h1>
        </div>
      </div>
    </>
  );
}
