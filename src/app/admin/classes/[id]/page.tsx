import { ThemeToggle } from "@/components/theme-toggle";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { notFound } from "next/navigation";
import { Id } from "../../../../../convex/_generated/dataModel";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

async function getClassData(id: string) {
  const request = {
    path: "classes:getClassById",
    args: { id: id },
    format: "json",
  };
  const res = await fetch(`${process.env.NEXT_PUBLIC_CONVEX_URL}/api/query`, {
    method: "POST",
    body: JSON.stringify(request),
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) return null;

  return await res.json();
}

async function getStudents(id: Id<"classes">[]) {
  const request = {
    path: "students:getStudentsByClass",
    args: { id: id },
    format: "json",
  };
  const res = await fetch(`${process.env.NEXT_PUBLIC_CONVEX_URL}/api/query`, {
    method: "POST",
    body: JSON.stringify(request),
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) return null;

  return await res.json();
}

export default async function ThisClassPage({
  params,
}: {
  params: { id: Id<"classes"> };
}) {
  const resData = await getClassData(params.id);
  const thisClass = resData.value;

  const idArray = [];
  idArray.push(params.id);

  const studentsData = await getStudents(idArray);
  console.log(studentsData);
  if (!studentsData) {
    console.log("why?");
  }
  const students = studentsData.value;
  console.log(students);

  if (!thisClass) {
    notFound(); // This will render a 404 page
  }

  return (
    <>
      <header className="group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/admin">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/admin/classes">Classes</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{thisClass.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="px-4">
          <ThemeToggle />
        </div>
      </header>
      <div className="flex flex-row items-end gap-6 p-12">
        <div>
          <h1 className="text-3xl font-semibold">{thisClass.name}</h1>
          <p>Time: {thisClass.time}</p>
          <p>Capacity: {thisClass.students?.length}</p>
        </div>
      </div>
      <Separator className="my-12 mb-8" />
      <div className="flex flex-col gap-4 px-20">
        <div className="flex flex-wrap gap-4">
          {students?.map(
            ({
              _id,
              firstName,
              lastName,
              team,
            }: {
              _id: Id<"students">;
              firstName: string;
              lastName: string;
              team: string[];
            }) => (
              <Card key={_id} className="p-8">
                <p key={_id}>
                  {firstName} {lastName}
                </p>
                <Badge key={_id}>{team}</Badge>
              </Card>
            ),
          )}
        </div>
      </div>
    </>
  );
}
