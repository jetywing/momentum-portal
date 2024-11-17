import { ThemeToggle } from "@/components/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { UserIcon } from "lucide-react";
import { notFound } from "next/navigation";
import { Id } from "../../../../../convex/_generated/dataModel";

async function getUserData(id: Id<"users">) {
  const request = {
    path: "users:getUserById",
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

async function getStudents(id: Id<"users">[]) {
  const request = {
    path: "students:getStudentsByAccount",
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

export default async function UserPage({
  params,
}: {
  params: { id: Id<"users"> };
}) {
  const resData = await getUserData(params.id);
  const user = resData.value;

  const idArray = [];
  idArray.push(params.id);

  const studentsData = await getStudents(idArray);
  const students = studentsData.value;
  console.log(students);

  if (!user) {
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
                <BreadcrumbLink href="/admin/clientele">
                  Clientele
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{user.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="px-4">
          <ThemeToggle />
        </div>
      </header>
      <div className="flex flex-row items-end gap-6 p-12">
        <Avatar className="h-32 w-32 rounded-full">
          <AvatarImage src={user?.image} alt={user?.name} />
          <AvatarFallback className="rounded-lg">
            <UserIcon size={64} />
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-semibold">{user.name}</h1>
          <p>{user.email}</p>
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
