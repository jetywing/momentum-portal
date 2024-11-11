"use client";

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
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { fetchMutation } from "convex/nextjs";
import { useRef } from "react";
import { Id } from "../../../../../convex/_generated/dataModel";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function CreateStudentPage() {
  const inputRef = useRef<HTMLInputElement>(null);

  async function createStudent(formData: FormData) {
    await fetchMutation(api.students.addStudent, {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      birthday: formData.get("birthday") as string,
      account: formData.get("accountId") as Id<"users">,
    });

    // Clear the input field
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  return (
    <>
      <header className="flex h-16 justify-between shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
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
                <BreadcrumbLink href="/admin/students">Students</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Create</BreadcrumbPage>
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
          <form
            className="flex gap-4 flex-col items-start"
            action={createStudent}
            onSubmit={(e) => {
              e.preventDefault();
              createStudent(new FormData(e.currentTarget));
            }}
          >
            <Input name="firstName" ref={inputRef} />
            <Button type="submit">Submit</Button>
          </form>
        </div>
      </div>
    </>
  );
}
