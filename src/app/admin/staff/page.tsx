import { Header } from "@/components/header";

export default function StaffPage() {
  return (
    <>
      <Header
        breadcrumbs={[{ title: "Dashboard", url: "/admin" }]}
        currentPage="Staff"
      />
      <h1 className="text-xl font-bold md:text-3xl">Staff</h1>
    </>
  );
}
