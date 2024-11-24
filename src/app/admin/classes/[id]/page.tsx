"use client";

import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { Id } from "../../../../../convex/_generated/dataModel";
import { Badge } from "@/components/ui/badge";
import { getClassData, getStudents } from "./actions";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { dayTimeFormat } from "@/lib/utils";
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

type Student = {
  _id: Id<"students">;
  idx?: number; // Optional index
  firstName: string; // Required first name
  lastName: string; // Required last name
  image?: string; // Optional image URL
  status: boolean; // Active status (e.g., enrolled or not)
  birthday?: string; // Optional birthday (e.g., "YYYY-MM-DD" or other format)
  team?: ("mdp" | "mdp2" | "club")[]; // Optional array of team names
  classes?: Id<"classes">[]; // Optional array of class IDs
  account?: Id<"users">[]; // Optional array of account/user IDs
  isAccHolder: boolean; // Whether the student is the account holder
};

export default function ThisClassPage({
  params,
}: {
  params: { id: Id<"classes"> };
}) {
  const router = useRouter();

  const classId = params.id;

  const [thisClass, setThisClass] = useState<Class | null>(null); // Adjust type as needed
  const [students, setStudents] = useState<Student[]>([]); // Adjust type as needed
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

        // Fetch associated students
        const studentsData = await getStudents(params.id);
        setStudents(studentsData?.value || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        router.push("/error"); // Redirect to a generic error page
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [params.id, router]);

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
      <div className="flex flex-row items-end gap-6 p-6 md:p-12">
        <div>
          <h1 className="text-3xl font-semibold">{thisClass.name}</h1>
          <p>Time: {dayTime}</p>
          <p>Capacity: {thisClass.students?.length}</p>
        </div>
      </div>
      <Separator className="my-12 mb-8" />
      <div className="relative flex flex-col gap-4 px-2 md:px-20">
        <div className="absolute right-2 top-2 md:right-20">
          <AddStudentDialog classId={classId} />
        </div>
        <h2 className="text-xl font-bold md:text-2xl">Class List</h2>
        <div className="flex flex-wrap gap-4 py-4">
          <Table>
            <TableCaption>Currently Enrolled Students</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Team</TableHead>
                <TableHead className="w-12">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="min-h-96">
              {students.length > 0 ? (
                students.map((student) => (
                  <TableRow key={student._id}>
                    <TableCell className="font-medium">
                      <Link
                        href={`/admin/students/${student._id}`}
                        className="duration-150 hover:opacity-60"
                      >
                        <p className="text-nowrap">
                          {student.firstName} {student.lastName}
                        </p>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Badge variant={"outline"}>{student.team}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <MoreHorizontal className="mx-auto" />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No students found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
}
