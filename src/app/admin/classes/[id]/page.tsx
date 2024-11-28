"use client";

import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { Id } from "../../../../../convex/_generated/dataModel";
import { getClassData, getStudents } from "./actions";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { calcAge, dayTimeFormat } from "@/lib/utils";
import { Header } from "@/components/header";
import { AddStudentDialog } from "@/components/add-student-dialog";
import Link from "next/link";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MoreHorizontal } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "../../../../../convex/_generated/api";

type Class = {
  _id: Id<"classes">;
  name: string;
  description?: string;
  type?: "team" | "rec";
  room?: string;
  day:
    | "Monday"
    | "Tuesday"
    | "Wednesday"
    | "Thursday"
    | "Friday"
    | "Saturday"
    | "Sunday";
  time: number; // Minutes since midnight
  duration: number; // Duration in minutes
  season?: string;
  capacity?: number; // Maximum capacity for the class
  students?: Id<"students">[]; // Array of student IDs
  instructor: Id<"users">[]; // Array of instructor IDs
};

export default function ThisClassPage({
  params,
}: {
  params: { id: Id<"classes"> };
}) {
  const router = useRouter();

  const classId = params.id;

  const [thisClass, setThisClass] = useState<Class | null>(null); // Adjust type as needed
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        // Fetch class data
        const resData = await getClassData(params.id);
        if (!resData?.value) {
          // router.push("/404"); // Redirect to a 404 page
          return;
        }
        setThisClass(resData.value);
      } catch (error) {
        console.error("Error fetching data:", error);
        router.push("/error"); // Redirect to a generic error page
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [params.id, router]);

  const { data, isPending, error } = useQuery(
    convexQuery(api.students.getStudentsByClass, { id: params.id }),
  );

  if (loading) {
    return (
      <div className="flex items-center space-x-4 p-20">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
    );
  }

  if (!thisClass) {
    return <div>Class not found.</div>; // Fallback if the class data is missing
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const dayTime = dayTimeFormat(thisClass.time);

  return (
    <>
      <Header
        breadcrumbs={[
          { title: "Dashboard", url: "/admin" },
          { title: "Classes", url: "/admin/classes" },
        ]}
        currentPage={thisClass.name}
      />
      <div className="flex justify-center">
        <div className="max-w-7xl flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="flex flex-col gap-6 p-2 md:p-12">
            <div>
              <div className="py-4">
                <h1 className="text-3xl font-semibold">{thisClass.name}</h1>
              </div>
              <div className="grid max-w-60 grid-cols-2 gap-2">
                <p className="font-semibold">Time: </p>
                <p>{dayTime}</p>
                <p className="font-semibold">Capacity: </p>
                <p>
                  {data?.length} / {thisClass.capacity}
                </p>
                <p className="font-semibold">Season: </p>
                <p>{thisClass.season}</p>
              </div>
            </div>
            <div className="pt-4">
              <p className="font-semibold">Description: </p>
              <p>{thisClass.description}</p>
            </div>
          </div>
          <Separator className="mb-6" />
          <div className="relative flex flex-col gap-4 px-2 md:px-12">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold md:text-2xl">Class List</h2>
              <AddStudentDialog classId={classId} />
            </div>
            <div className="flex flex-wrap gap-4 py-4">
              <Table>
                <TableCaption>Currently Enrolled Students</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Age</TableHead>
                    <TableHead>Team</TableHead>
                    <TableHead className="w-12">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="min-h-96">
                  {isPending ? (
                    <TableRow>
                      <TableCell colSpan={3}>
                        <p>Loading...</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    data?.map((student) => (
                      <TableRow key={student?._id}>
                        <TableCell className="font-medium w-1/4">
                          <Link
                            href={`/admin/students/${student?._id}`}
                            className="duration-150 w-min hover:opacity-60"
                          >
                            {student?.firstName} {student?.lastName}
                          </Link>
                        </TableCell>
                        <TableCell>
                          {student?.birthday ? calcAge(student?.birthday) : "?"}
                        </TableCell>
                        <TableCell>{student?.team?.join(", ")}</TableCell>
                        <TableCell className="text-right">
                          <MoreHorizontal className="mx-auto" />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
